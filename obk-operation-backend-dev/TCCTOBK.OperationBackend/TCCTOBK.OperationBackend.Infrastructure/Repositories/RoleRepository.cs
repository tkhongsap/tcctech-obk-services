using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RoleRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Repositories;

internal class RoleRepository : BaseRepository<trRole>, IRoleRepository
{
	private readonly IClientSiteService _clientSiteService;

	public RoleRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<Guid> CreateRole(CreateRoleModel role, AuditableModel auditable)
	{
		var newRoleId = Guid.NewGuid();
		var newRole = new trRole()
		{
			RID = newRoleId,
			Name = role.Name,
			Description = role.Description,
			IsActive = role.IsActive,
			TID = Constant.TENANT_OBKCMS_ID,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
			CSID = _clientSiteService.ClientSiteId
		};
		await Db.AddAsync(newRole);
		return newRoleId;
	}

	public Task<List<trRole>> GetAll(string? filter, List<Guid>? privilege, Guid? tenantId, TableState state)
	{
		var query = GetAllQueryBuilder(filter, privilege, tenantId);
		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}
		query = query.Where(x => x.IsDelete != true);
		return query.Skip(state.Skip).Take(state.Take).Include(x => x.trRolePrivilagesItem).ThenInclude(x => x.mtPrivilegeItem).ThenInclude(x => x.mtPrivilege).ToListAsync();
	}

	public Task<int> GetAllCount(string? filter, List<Guid>? privilege, Guid? tenantId)
	{
		var query = GetAllQueryBuilder(filter, privilege, tenantId);
		return query.CountAsync();
	}

	private IQueryable<trRole> GetAllQueryBuilder(string? filter, List<Guid>? privilege, Guid? tenantId)
	{
		var query = Db.Include(x => x.trRolePrivilagesItem).ThenInclude(x => x.mtPrivilegeItem).AsQueryable();
		query = query.Where(x => x.CSID == _clientSiteService.ClientSiteId);
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.RID.ToString().ToLower().Contains(filter.ToLower()) || x.Name.ToLower().Contains(filter.ToLower()) || x.trRolePrivilagesItem.Any(p => p.mtPrivilegeItem.Name.ToLower().Contains(filter.ToLower())));
		}
		if (privilege != null && privilege.Count > 0)
		{
			query = query.Where(x => x.trRolePrivilagesItem.Any(item => privilege.Contains(item.mtPrivilegeItem.PTID)));
		}
		if (tenantId != null)
		{
			query = query.Where(x => x.TID == tenantId);
		}
		return query;
	}

	public async Task<List<trRole>> GetByFilterAndStatus(string? filter = null, bool? status = null)
	{
		var roles = Db;
		if (filter != null)
		{
			roles.Where(x => filter.Contains(x.Name) ||
											filter.Contains(x.RID.ToString()));
		}
		if (status != null)
		{
			roles.Where(x => x.IsActive == status);
		}
		var result = await roles.ToListAsync();
		return result;
	}

	public async Task<trRole> GetById(Guid id)
	{
		var role = await Db.Include(x => x.trRolePrivilagesItem).ThenInclude(x => x.mtPrivilegeItem).FirstOrDefaultAsync(x => x.RID == id) ?? throw new NotFoundException("ไม่พบ role");
		return role;
	}

	public async Task<List<trRole>> GetByMember(Guid mid)
	{
		var rolemember = await Context.RoleMembers.Include(x => x.trRole).ThenInclude(x => x.trRolePrivilagesItem).ThenInclude(x => x.mtPrivilegeItem).Where(x => x.IsActive && x.MID == mid).ToListAsync();
		var res = rolemember.Select(x => x.trRole).ToList();
		return res;
	}

	public async Task<List<trRole>> GetByName(string name)
	{
		var result = await Db.Where(x => x.Name == name).ToListAsync();
		return result;
	}


	public async Task UpdateRole(UpdateRoleModel role, AuditableModel auditable)
	{
		var frole = await Db.AsTracking().Where(x => x.RID == role.RID && x.CSID == _clientSiteService.ClientSiteId).Include(x => x.trRolePrivilagesItem).FirstAsync();
		var roleNameExist = await Db.Where(x => x.Name == role.Name && x.RID != role.RID).AnyAsync();
		if (roleNameExist) throw new BadRequestException("Role name ชื่อซ้ำกันในระบบ");
		frole.Name = role.Name;
		frole.RID = role.RID;
		frole.IsActive = role.IsActive;
		frole.Description = role.Description;
		frole.UpdatedBy = auditable.UpdatedBy;
		frole.UpdatedByName = auditable.UpdatedByName!;
		frole.UpdatedDate = auditable.UpdatedDate;
		frole.CSID = _clientSiteService.ClientSiteId;

		var rolePrivileges = role.Privilages
				.Select(x => new trRolePrivilegeItem
				{
					PTID = x,
					RID = frole.RID,
					IsActive = true
				})
				.ToList();


		await Context.RolePrivilegesItem.AddRangeAsync(rolePrivileges);
		Db.Update(frole);
	}

	public async Task UpdateRoleMember(Guid mid, List<Guid> rid)
	{
		var member = await Context.Member.AsTracking()
			.FirstOrDefaultAsync(x => mid == x.MID)
			?? throw new NotFoundException("ไม่พบ Member");

		var frole = Db.Where(x => x.CSID == _clientSiteService.ClientSiteId && x.TID == Constant.TENANT_OBKCMS_ID).ToList();

		var ridInThisCSID = frole.Select(r => r.RID).ToList();

		frole.ForEach(x =>
		{
			var fmemberrole = Context.RoleMembers.AsTracking()
							.Where(x => x.MID == mid && ridInThisCSID.Contains(x.RID));
			Context.RoleMembers.RemoveRange(fmemberrole);
		});
		// var fmemberrole = Context.RoleMembers.AsTracking()
		// 		.Where(x => x.MID == mid);
		// Context.RoleMembers.RemoveRange(fmemberrole);
		foreach (var item in rid)
		{
			var role = await Db.FirstOrDefaultAsync(x => x.RID == item)
					?? throw new NotFoundException("ไม่พบ Role");
			var nmb = new trRoleMember()
			{
				IsActive = true,
				MID = mid,
				RID = item
			};
			Context.RoleMembers.Add(nmb);
		}
	}

	public async Task UpdateRoleMember(Guid mid, List<Guid> rid, Guid tid)
	{
		//TODO : if role 
		var member = await Context.Member.AsTracking()
			.FirstOrDefaultAsync(x => mid == x.MID)
			?? throw new NotFoundException("ไม่พบ Member");

		var newRoleCSIDs = await Context.Roles
		.Where(r => rid.Contains(r.RID) && r.TID == tid)
		.Select(r => r.CSID)
		.Distinct()
		.ToListAsync();

		if (!newRoleCSIDs.Any())
			throw new NotFoundException("ไม่พบ CSID จาก Role ที่ส่งเข้ามา");

		var fmemberrole = Context.RoleMembers
			.AsTracking()
			.Include(x => x.trRole)
			.Where(
				x => x.MID == mid &&
				x.trRole.TID == tid &&
				newRoleCSIDs.Contains(x.trRole.CSID));

		Context.RoleMembers.RemoveRange(fmemberrole);
		foreach (var item in rid)
		{
			var role = await Db.FirstOrDefaultAsync(x => x.RID == item)
					?? throw new NotFoundException("ไม่พบ Role");
			var nmb = new trRoleMember()
			{
				IsActive = true,
				MID = mid,
				RID = item
			};
			Context.RoleMembers.Add(nmb);
		}
	}

	public Task<int> ClearPrivilege(Guid rid)
	{
		return Context.RolePrivilegesItem.Where(x => x.RID == rid).ExecuteDeleteAsync();
	}

	public async Task UpdateRoleStatus(Guid rid, bool status, AuditableModel auditable)
	{
		var frole = await Db.AsTracking().FirstOrDefaultAsync(x => x.RID == rid) ?? throw new NotFoundException("ไม่พบ role");
		frole.IsActive = status;
		frole.UpdatedBy = auditable.UpdatedBy;
		frole.UpdatedByName = auditable.UpdatedByName!;
		frole.UpdatedDate = auditable.UpdatedDate;
		frole.CSID = _clientSiteService.ClientSiteId;
	}

	public Task<int> RemoveRole(Guid roleId, AuditableModel auditable)
	{
		return Db.Where(x => x.RID == roleId).ExecuteUpdateAsync(updates => updates
				.SetProperty(p => p.IsActive, false)
				.SetProperty(p => p.IsDelete, true)
		.SetProperty(p => p.CSID, _clientSiteService.ClientSiteId)
		.SetProperty(p => p.UpdatedBy, auditable.UpdatedBy)
		.SetProperty(p => p.UpdatedByName, auditable.UpdatedByName)
		.SetProperty(p => p.UpdatedDate, auditable.UpdatedDate));
	}

	public async Task<List<trRole>> GetRoleByRefId(List<int> refId)
	{
		var role = await Db.Where(x => refId.Contains(x.RefId) && x.CSID == _clientSiteService.ClientSiteId).ToListAsync();
		return role;
	}

}
