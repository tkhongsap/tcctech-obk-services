using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.Json;
using System.Linq.Dynamic.Core;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using Microsoft.EntityFrameworkCore.DynamicLinq;

namespace TCCTOBK.OperationBackend.Application.Repositories;

internal class MemberRepository : BaseRepository<taMember>, IMemberRepository
{
	private readonly IClientSiteService _clientSiteService;
	public MemberRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<List<taMember>> GetAll()
	{
		var query = await Db.Where(x => x.IsAvailable == true).Include(x => x.trRoleMembers).ThenInclude(x => x.trRole).ToListAsync();
		return query;
	}


	public async Task<List<taMember>> GetAll(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state)
	{
		var query = GetAllQueryBuilder(filter, roleid, status, tenantIds, isAvailable);

		if (!string.IsNullOrEmpty(state.OrderingName))
		{
			query = query.OrderBy(state.OrderingName);
		}

		if (state.Skip > 0) query = query.Skip(state.Skip).Take(state.Take);

		return await query
			.Include(x => x.trRoleMembers
				.Where(rm =>
					(rm.trRole.CSID == _clientSiteService.ClientSiteId) &&
					(tenantIds.Contains(rm.trRole.TID))
				)
			)
			.ThenInclude(rm => rm.trRole)
			.ToListAsync();


	}

	public Task<List<taMember>> GetAllReport(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable)
	{
		var query = GetAllQueryBuilder(filter, roleid, status, tenantIds, isAvailable);
		query = query.OrderByDescending(x => x.UpdatedDate);
		return query.Include(x => x.trRoleMembers).ThenInclude(x => x.trRole).ToListAsync();
	}

	public Task<List<taMember>> GetByTenant(Guid tenantId)
	{
		var query = Context.TenantMember.Where(x => x.TID == tenantId).Select(x => x.taMember);
		query = query.Where(x => x.IsActive && x.Status == Constant.MEMBERSTATUS_GRANTED);
		return query.ToListAsync();
	}

	private IQueryable<taMember> GetAllQueryBuilder(string? filter, List<Guid> role, int? status, List<Guid>? tenantIds, bool isAvailable)
	{
		var query = Db.AsQueryable();
		query = query.Where(x => x.ClientMember.Any(cm => cm.CSID == _clientSiteService.ClientSiteId));
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.MID.ToString().ToLower() == filter.ToLower() || x.Name.ToLower().Contains(filter.ToLower()) || x.Email.ToLower().Contains(filter.ToLower()) || x.trRoleMembers.Any(x => x.trRole.Name.ToLower().Contains(filter.ToLower())));
		}
		if (role.Count() > 0)
		{
			query = query.Where(x => x.trRoleMembers.Any(x => role.Contains(x.RID)));
		}
		if (status != null)
		{
			query = query.Where(x => x.Status == status);
		}
		if (tenantIds != null)
		{
			query = query.Where(x => x.tenantMembers.Any(t => tenantIds.Contains(t.TID)));
		}
		if (isAvailable)
		{
			query = query.Where(x => x.IsAvailable == isAvailable);
		}
		return query;
	}
	public async Task<taMember> GetById(Guid id)
	{
		var result = await Db.Include(x => x.trRoleMembers).Include(x => x.tenantMembers).FirstOrDefaultAsync(x => x.IsActive && x.MID == id);
		if (result == null) throw new NotFoundException("ไม่พบ member");
		return result;
	}
	public async Task<taMember> GetByIdWithOutActive(Guid id)
	{
		var result = await Db.Include(x => x.trRoleMembers).Include(x => x.tenantMembers).FirstOrDefaultAsync(x => x.MID == id);
		if (result == null) throw new NotFoundException("ไม่พบ member");
		return result;
	}
	public async Task<taMember> GetByIdWithOutCatch(Guid id)
	{
		var result = await Db.Include(x => x.FunctionRoleLocation).Include(x => x.trRoleMembers).Include(x => x.tenantMembers).Include(x => x.ClientMember).FirstOrDefaultAsync(x => x.IsActive && x.MID == id);
		return result;
	}
	public async Task<taMember> GetByIdWithOutCatchWithOutActive(Guid id)
	{
		var result = await Db.Include(x => x.FunctionRoleLocation).Include(x => x.trRoleMembers).Include(x => x.tenantMembers).Include(x => x.ClientMember).FirstOrDefaultAsync(x => x.MID == id);
		return result;
	}

	public async Task<taMember> UpdateById(Guid id)
	{
		var result = await Db.AsTracking().Include(x => x.trRoleMembers).FirstOrDefaultAsync(x => x.IsActive && x.MID == id);
		if (result == null) throw new NotFoundException("ไม่พบ member");
		return result;
	}

	public async Task<taMember> GetByKeyCloakUserId(string keyCloakUserId)
	{
		var result = await Db.Where(x => x.IsActive && x.KeyCloakUserId == keyCloakUserId).Include(x => x.trRoleMembers).Include(x => x.ClientMember).FirstOrDefaultAsync();
		if (result == null) throw new NotFoundException("ไม่พบ member kc");
		return result;
	}

	public async Task<taMember> GetByKeyCloakUserId(string keyCloakUserId, bool isCheckIsActive)
	{
		var result = Db.Where(x => x.KeyCloakUserId == keyCloakUserId).Include(x => x.trRoleMembers).Include(x => x.ClientMember);
		if (result == null) throw new NotFoundException("ไม่พบ member kc");
		if (isCheckIsActive)
		{
			var res = await result.FirstOrDefaultAsync(x => x.IsActive);
			return res;
		}
		else
		{
			var res = await result.FirstOrDefaultAsync();
			return res;
		}

	}

	public Task<bool> CheckTenant(Guid mid, Guid tenantId)
	{
		return Context.TenantMember.AnyAsync(x => x.MID == mid && x.TID == tenantId);
	}

	public async Task<List<taMember>> GetByFilter(string? filter = null, List<Guid>? roleids = null)
	{
		var members = Db;
		if (filter != null)
		{
			members.Where(x => filter.Contains(x.MID.ToString()) || filter.Contains(x.Email));
		}
		if (roleids != null)
		{
		}
		var result = await members.ToListAsync();
		return result;
	}
	public async Task<Guid> CreateMember(string email, int status, List<Guid> roles, AuditableModel auditable)
	{
		var memberjson = new MemberDataJsonModel()
		{
			Email = email,
			Name = "",
			EmailActivities = new()
		};
		var tamember = new taMember()
		{
			Email = email,
			MID = Guid.NewGuid(),
			Status = status,
			IsActive = true,
			IsLocked = false,
			FailAttempt = 0,
			DataJson = JsonSerializer.Serialize(memberjson),
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,

		};
		await Db.AddAsync(tamember);

		var existingroles = await Context.Roles.AsTracking().Where(x => roles.Contains(x.RID)).ToListAsync();
		await Context.RoleMembers.AddRangeAsync(existingroles.Select(role => new trRoleMember
		{
			//taMember = tamember,
			MID = tamember.MID,
			//trRole = role,
			RID = role.RID,
			IsActive = true
		}));
		await Context.ClientMember.AddAsync(new ClientMember
		{
			MID = tamember.MID,
			CSID = _clientSiteService.ClientSiteId,
		});
		return tamember.MID;
	}

	public async Task<Guid> CreateMember(string email, int status, List<Guid> roles, string keyCloakUserId, AuditableModel auditable)
	{
		var memberjson = new MemberDataJsonModel()
		{
			Email = email,
			Name = "",
			EmailActivities = new()
		};
		var tamember = new taMember()
		{
			Email = email,
			MID = Guid.NewGuid(),
			Status = status,
			IsActive = true,
			IsLocked = false,
			FailAttempt = 0,
			KeyCloakUserId = keyCloakUserId,
			DataJson = JsonSerializer.Serialize(memberjson),
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,

		};
		await Db.AddAsync(tamember);

		var existingroles = await Context.Roles.AsTracking().Where(x => roles.Contains(x.RID)).ToListAsync();
		await Context.RoleMembers.AddRangeAsync(existingroles.Select(role => new trRoleMember
		{
			//taMember = tamember,
			MID = tamember.MID,
			//trRole = role,
			RID = role.RID,
			IsActive = true
		}));
		return tamember.MID;
	}

	public async Task<Guid> CreateMember(string email, string name, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable)
	{
		var tamember = new taMember()
		{
			Email = email,
			MID = Guid.NewGuid(),
			Name = name,
			Status = status,
			IsActive = true,
			IsLocked = false,
			FailAttempt = 0,
			KeyCloakUserId = keyCloakUserId,
			DataJson = dataJson,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
		};
		await Db.AddAsync(tamember);

		var existingroles = await Context.Roles.AsTracking().Where(x => roles.Contains(x.RID)).ToListAsync();
		await Context.RoleMembers.AddRangeAsync(existingroles.Select(role => new trRoleMember
		{
			MID = tamember.MID,
			RID = role.RID,
			IsActive = true
		}));
		return tamember.MID;
	}
	public async Task<Guid> CreateMember(string email, string firstname, string lastname, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable)
	{
		var tamember = new taMember()
		{
			Email = email,
			MID = Guid.NewGuid(),
			Name = $"{firstname} {lastname}",
			FirstName = firstname,
			LastName = lastname,
			Status = status,
			IsActive = true,
			IsLocked = false,
			FailAttempt = 0,
			KeyCloakUserId = keyCloakUserId,
			DataJson = dataJson,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
		};
		await Db.AddAsync(tamember);

		var existingroles = await Context.Roles.AsTracking().Where(x => roles.Contains(x.RID)).ToListAsync();
		await Context.RoleMembers.AddRangeAsync(existingroles.Select(role => new trRoleMember
		{
			MID = tamember.MID,
			RID = role.RID,
			IsActive = true
		}));
		await Context.ClientMember.AddAsync(new ClientMember
		{
			MID = tamember.MID,
			CSID = _clientSiteService.ClientSiteId,
			StaffId = null,
			DataJson = dataJson
		});
		return tamember.MID;
	}
	public async Task<Guid> CreateMember(string email, string firstname, string lastname, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable, Guid? csid)
	{
		var tamember = new taMember()
		{
			Email = email,
			MID = Guid.NewGuid(),
			Name = $"{firstname} {lastname}",
			FirstName = firstname,
			LastName = lastname,
			Status = status,
			IsActive = true,
			IsLocked = false,
			FailAttempt = 0,
			KeyCloakUserId = keyCloakUserId,
			DataJson = dataJson,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
		};
		await Db.AddAsync(tamember);

		var existingroles = await Context.Roles.AsTracking().Where(x => roles.Contains(x.RID)).ToListAsync();
		await Context.RoleMembers.AddRangeAsync(existingroles.Select(role => new trRoleMember
		{
			MID = tamember.MID,
			RID = role.RID,
			IsActive = true
		}));
		await Context.ClientMember.AddAsync(new ClientMember
		{
			MID = tamember.MID,
			CSID = csid ?? Constant.OBK_CLIENT_SITE,
			StaffId = null,
			DataJson = dataJson
		});
		return tamember.MID;
	}

	public async Task<Guid> UpdateStatusMember(Guid mid, int status, List<Guid> roles, AuditableModel auditable)
	{
		var m = await UpdateById(mid);
		m.Status = status;
		m.UpdatedDate = auditable.UpdatedDate;
		m.UpdatedBy = auditable.UpdatedBy;
		m.UpdatedByName = auditable.UpdatedByName!;


		foreach (var role in m.trRoleMembers)
		{
			role.IsActive = roles.Contains(role.RID);//setactive
		}

		var trroles = await Context.Roles.Where(x => roles.Contains(x.RID)).ToListAsync();//roles ที่ส่งมาทั้งหมด
		var rolesid = m.trRoleMembers.Select(x => x.RID);//roles ปัจจุบัน

		var symdif = roles.Except(rolesid).Union(rolesid.Except(roles));
		var rolemembers = new List<trRoleMember>();

		foreach (var item in symdif)
		{
			var role = trroles.FirstOrDefault(x => x.RID == item);
			if (role == null) continue;
			rolemembers.Add(new trRoleMember
			{
				taMember = m,
				MID = m.MID,
				trRole = role,
				RID = role.RID,
				IsActive = true,
			});
		}
		await Context.RoleMembers.AddRangeAsync(rolemembers);
		return m.MID;
	}

	public async Task<Guid> UpdateStatusMember(Guid mid, int status, AuditableModel auditable)
	{
		var m = await UpdateById(mid);
		m.Status = status;
		m.UpdatedDate = auditable.UpdatedDate;
		m.UpdatedBy = auditable.UpdatedBy;
		m.UpdatedByName = auditable.UpdatedByName!;
		return m.MID;
	}

	public async Task<string?> GetMemberNameByKeyCloakUserId(string keyCloakUserId)
	{
		var result = await Db.Where(x => x.KeyCloakUserId != null && x.KeyCloakUserId == keyCloakUserId).FirstOrDefaultAsync();
		return result?.Name;
	}

	public async Task<List<trRoleMember>> GetMemberRole()
	{
		var memberrole = await Context.RoleMembers.Include(x => x.trRole).Include(x => x.taMember).ToListAsync();
		return memberrole;

	}

	public async Task<trRoleMember> GetMemberRole(Guid mid)
	{
		var memberrole = await Context.RoleMembers.Include(x => x.trRole).Include(x => x.taMember).FirstOrDefaultAsync(x => x.MID == mid) ?? throw new NotFoundException("ไม่พบ member role");
		return memberrole;

	}

	public Task<List<taMember>> GetMemebersByRole(Guid roleId)
	{
		return Context.RoleMembers
				.Where(x => (x.RID == roleId) && x.taMember.IsActive)
				.Include(x => x.taMember)
				.ThenInclude(x => x.ClientMember)
				.Select(x => x.taMember)
				.Where(x => x.ClientMember.Any(cm => cm.CSID == _clientSiteService.ClientSiteId))
				.ToListAsync();
	}
	public async Task<taMember> GetByEmail(string email)
	{
		var res = await Db.Include(x => x.tenantMembers).FirstOrDefaultAsync(x => x.Email == email && x.IsActive);
		return res;
	}

	public async Task<taMember> GetByEmailLower(string email)
	{
		var res = await Db.Include(x => x.tenantMembers).Include(x => x.ClientMember).Include(x => x.trRoleMembers).ThenInclude(x => x.trRole).FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower() && x.IsActive);
		return res;
	}
	public async Task<taMember> GetByEmailLower(string email, bool isCheckIsActive)
	{
		if (isCheckIsActive)
		{
			var res = await Db.Include(x => x.tenantMembers).Include(x => x.ClientMember).Include(x => x.trRoleMembers).ThenInclude(x => x.trRole).FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower() && x.IsActive);
			return res;
		}
		else
		{
			var res = await Db.Include(x => x.tenantMembers).Include(x => x.ClientMember).Include(x => x.trRoleMembers).ThenInclude(x => x.trRole).FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
			return res;
		}
	}

	public async Task<taMember> GetByEmailLowerWithOutActive(string email)
	{
		var res = await Db.Include(x => x.tenantMembers).FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
		return res;
	}
	public async Task<Guid> UpdateMember(Guid mid, string name, int status, bool isactive, AuditableModel auditable)
	{
		var user = await UpdateById(mid);
		user.Status = status;
		user.Name = name;
		user.IsActive = isactive;
		user.UpdatedDate = auditable.UpdatedDate;
		user.UpdatedBy = auditable.UpdatedBy;
		user.UpdatedByName = auditable.UpdatedByName!;
		return user.MID;
	}

	public async Task<Guid> UpdateEmailActivityMember(Guid mid, EmailActivityModel emaildata, AuditableModel auditable)
	{
		var member = await UpdateById(mid);
		try
		{
			var emailinvite = JsonSerializer.Deserialize<MemberDataJsonModel>(member.DataJson);
			emailinvite.EmailActivities.Add(emaildata);
			member.DataJson = JsonSerializer.Serialize(emailinvite);
			member.UpdatedDate = auditable.UpdatedDate;
			member.UpdatedBy = auditable.UpdatedBy;
			member.UpdatedByName = auditable.UpdatedByName!;
			return member.MID;
		}
		catch (ApplicationException ex)
		{
			throw new BadRequestException("รูปแบบข้อมูลไม่ถูกต้อง");
		}
	}


	public async Task<Guid> UpdateMember(Guid mid, string name, int status, string userkeycloak, AuditableModel auditable)
	{
		var user = await UpdateById(mid);
		user.Status = status;
		user.Name = name;
		if (user.FirstName == null)
		{
			user.Name = name;
			user.LastName = "-";
		}
		user.KeyCloakUserId = userkeycloak;
		user.UpdatedDate = auditable.UpdatedDate;
		user.UpdatedBy = auditable.UpdatedBy;
		user.UpdatedByName = auditable.UpdatedByName!;

		if (user.Status == Constant.MEMBERSTATUS_GRANTED)
		{
			var invitecode = await Context.InviteMember.Where(x => x.MID == mid).ToListAsync();
			foreach (var item in invitecode)
			{
				item.IsActive = false;
			}
		}
		return user.MID;
	}

	public Task<int> GetAllCount(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state)
	{
		var query = GetAllQueryBuilder(filter, roleid, status, tenantIds, isAvailable);
		return query.CountAsync();
	}

	public async Task InsertTenantMember(Guid memberId, Guid tenentId, Guid? csid)
	{
		var data = new TenantMember
		{
			MID = memberId,
			TID = tenentId,
			CSID = csid ?? Constant.OBK_CLIENT_SITE
		};

		await Context.TenantMember.AddAsync(data);
	}

	public async Task InsertTenantMember(Guid memberId, Guid tenentId)
	{
		var data = new TenantMember
		{
			MID = memberId,
			TID = tenentId,
			CSID = _clientSiteService.ClientSiteId
		};

		await Context.TenantMember.AddAsync(data);
	}


	public async Task<taMember?> UpdateFailAttempt(string email)
	{
		var member = await Db.AsTracking().Where(x => x.Email == email).Include(x => x.tenantMembers).FirstOrDefaultAsync();
		if (member == null)
		{
			return null;
		}
		if (member.tenantMembers.Select(x => x.TID).Contains(Constant.TENANT_OPERATION_APP_ID))
		{
			member.FailAttempt++;
			if (member.FailAttempt >= 3)
			{
				member.IsLocked = true;
			}
			// Db.Update(member);
			return member;
		}
		return null;
	}

	public async Task<taMember?> ResetFailAttempt(Guid mid)
	{
		var member = await Db.Where(x => x.MID == mid).FirstOrDefaultAsync();
		if (member == null)
		{
			return null;
		}
		member.FailAttempt = 0;
		member.LastLoginDateTime = DateTime.UtcNow;
		member.IsAvailable = true;
		Db.Update(member);
		return member;
	}

	public async Task<taMember?> Logout(Guid mid)
	{
		var member = await Db.Where(x => x.MID == mid).FirstOrDefaultAsync();
		if (member == null)
		{
			return null;
		}
		member.LastLogoutDateTime = DateTime.UtcNow;
		member.IsAvailable = false;
		Db.Update(member);
		return member;
	}

	public async Task UpdateDataJson(Guid id, string datajson)
	{
		var result = await Db.AsTracking().Include(x => x.trRoleMembers).FirstOrDefaultAsync(x => x.IsActive && x.MID == id);
		result.DataJson = datajson;
	}

	public async Task<taMember?> UnlockMemberById(Guid mid)
	{
		var member = await Db.Where(x => x.MID == mid).FirstOrDefaultAsync();
		if (member == null)
		{
			return null;
		}
		member.FailAttempt = 0;
		member.IsLocked = false;
		Db.Update(member);
		return member;
	}

	public async Task<taMember?> IsActiveById(Guid mid, Boolean isActive)
	{
		var member = await Db.Where(x => x.MID == mid).FirstOrDefaultAsync();
		if (member == null)
		{
			return null;
		}
		member.IsActive = isActive;
		Db.Update(member);
		return member;
	}

	public async Task UpdateMemberStaffId(Guid? mid, int staffId)
	{

		var member = await Context.ClientMember.AsTracking().FirstOrDefaultAsync(x => x.MID == mid) ?? throw new NotFoundException("ไม่พบ Member");
		member.StaffId = staffId;
	}

	public async Task UpsertFunctionRoleLocation(Guid mid, List<CreateFunctionRolesLocationMember> funcRoleLocation)
	{
		var member = await Context.Member.AsTracking()
			.FirstOrDefaultAsync(x => mid == x.MID)
			?? throw new NotFoundException("ไม่พบ SOCUser");
		var fmemberrole = Context.FunctionRoleLocationMember.AsTracking()
			.Where(x => x.MID == mid && x.CSID == _clientSiteService.ClientSiteId);
		Context.FunctionRoleLocationMember.RemoveRange(fmemberrole);
		foreach (var item in funcRoleLocation)
		{
			var frl = new trFunctionRoleLocationMember()
			{
				MID = mid,
				LocationId = (int)item.LocationId,
				FunctionRoleId = (int)item.FunctionRoleId,
				CSID = _clientSiteService.ClientSiteId
			};
			Context.FunctionRoleLocationMember.Add(frl);
		}
	}

	public async Task<taMember> GetByEmail(string email, bool isUseKC)
	{
		var res = await Db.Include(x => x.tenantMembers).FirstOrDefaultAsync(x => x.Email == email && x.IsActive && x.KeyCloakUserId != null);
		return res;
	}

	public async Task<List<ClientMember>> GetClientMembers(string kcuserid)
	{
		var member = await Db.FirstOrDefaultAsync(x => x.KeyCloakUserId == kcuserid);
		if (member == null) throw new NotFoundException("ไม่พบ member");
		var query = await Context.ClientMember.Where(x => x.MID == member.MID).ToListAsync();
		return query;
	}

	public async Task<taMember> GetByStaffId(int staffid)
	{
		var data = await Db.FirstOrDefaultAsync(x => x.StaffId == staffid);
		return data;
	}

	public Task<List<taMember>> GetByTenant(Guid tenantId, bool scopeClientSite)
	{
		var query = Context.TenantMember.Where(x => x.TID == tenantId).Select(x => x.taMember);
		query = query.Where(x => x.IsActive && x.Status == Constant.MEMBERSTATUS_GRANTED);
		if (scopeClientSite)
		{
			query = query.Where(x => x.ClientMember.Any(cm => cm.CSID == _clientSiteService.ClientSiteId));
		}
		return query.ToListAsync();
	}

	public async Task<taMember> GetByEmail(string email, bool isUseKC, bool isScopeClientSite)
	{
		var res = await Db.Include(x => x.tenantMembers).FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower() && x.IsActive && x.KeyCloakUserId != null && x.ClientMember.Any(cm => cm.CSID == _clientSiteService.ClientSiteId));
		return res;
	}

	public async Task<taMember> GetByStaffId(int staffid, bool isScopeClientSite)
	{
		if (!isScopeClientSite)
		{
			var data = await Db.FirstOrDefaultAsync(x => x.StaffId == staffid);
			return data;
		}
		var dt = await Db.FirstOrDefaultAsync(x => x.ClientMember.Any(cm => cm.CSID == _clientSiteService.ClientSiteId) && x.ClientMember.Any(cm => cm.StaffId == staffid));
		return dt;
	}

	public async Task updateByKeycloak(string id, AuditableModel resetPass)
	{
		var data = await Db.AsTracking().FirstOrDefaultAsync(x => x.KeyCloakUserId == id);
		data.UpdatedBy = resetPass.UpdatedBy;
		data.UpdatedByName = resetPass.UpdatedByName;
		data.UpdatedDate = resetPass.UpdatedDate;
	}

	public async Task AddClientMember(Guid mid)
	{
		await Context.ClientMember.AddAsync(new ClientMember
		{
			MID = mid,
			CSID = _clientSiteService.ClientSiteId,
		});
	}

	public Task<bool> CheckClientMember(Guid mid, Guid csid)
	{
		return Context.ClientMember.AnyAsync(x => x.MID == mid && x.CSID == csid);
	}

	public async Task AddClientMember(Guid mid, int staffid, string datajson)
	{
		await Context.ClientMember.AddAsync(new ClientMember
		{
			MID = mid,
			CSID = _clientSiteService.ClientSiteId,
			StaffId = staffid,
			DataJson = datajson
		});
	}

	public async Task InsertTenantMember(Guid memberId, Guid tenentId, Guid? csid, Guid updatedBy, string updatedByName)
	{
		var user = await Db.AsTracking().FirstOrDefaultAsync(x => x.MID == memberId);
		user.UpdatedBy = updatedBy;
		user.UpdatedByName = updatedByName;
		user.UpdatedDate = DateTime.Now;

		var data = new TenantMember
		{
			MID = memberId,
			TID = tenentId,
			CSID = csid ?? Constant.OBK_CLIENT_SITE
		};

		await Context.TenantMember.AddAsync(data);
	}

	public async Task StampUpdatedBy(Guid mid, Guid updatedBy, string updatedByName)
	{
		var member = await Db.AsTracking().FirstOrDefaultAsync(x => x.MID == mid) ?? throw new NotFoundException("ไม่พบ Member");
		member.UpdatedBy = updatedBy;
		member.UpdatedByName = updatedByName;
		member.UpdatedDate = DateTime.UtcNow;
		Db.Update(member);
	}
}


