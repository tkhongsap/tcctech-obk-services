using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Repositories;

public class PrivilegeRepository : BaseRepository<mtPrivilege>, IPrivilegeRepository
{
	public PrivilegeRepository(ITCCTOBKContext context) : base(context)
	{
	}
	public async Task<mtPrivilege> CreatePrivilege(mtPrivilege privilege, List<mtPrivilegeItem> privilegeitem)
	{
		var nprivilege = new mtPrivilege
		{
			PID = Guid.NewGuid(),
			Name = privilege.Name,
			Description = privilege.Description,
			IsActive = privilege.IsActive,
		};
		foreach (var item in privilegeitem)
		{
			var npitm = new mtPrivilegeItem()
			{
				PTID = Guid.NewGuid(),
				PID = nprivilege.PID,
				mtPrivilege = nprivilege,
				Name = item.Name,
				Description = item.Description,
				Code = item.Code,
				IsActive = item.IsActive,
			};
			nprivilege.mtPrivilegeItems.Add(npitm);
		}
		await Context.PrivilegeItems.AddRangeAsync(nprivilege.mtPrivilegeItems);
		Db.Add(nprivilege);
		return nprivilege;
	}

	public async Task CreatePrivileges(List<mtPrivilege> privileges)
	{
		await Db.AddRangeAsync(privileges);
	}

	public async Task<List<mtPrivilege>> GetAll(string? name = null, Guid? ptid = null, int skip = 0, int? take = null)
	{
		var result = Db.Include(x => x.mtPrivilegeItems).ToList();
		if (!string.IsNullOrEmpty(name))
		{
			result = result.Where(x => x.Name.Contains(name)).ToList();
		}
		result.Skip(skip);
		if (take != null)
		{
			result.Take(skip);
		}
		if (ptid != null)
		{
			result = result.Where(x => x.mtPrivilegeItems.Any(a => a.PTID == ptid)).ToList();
		}
		return result.ToList();
	}

	public async Task<mtPrivilegeItem> GetByCode(string code)
	{
		var result = await Context.PrivilegeItems.FirstOrDefaultAsync(x => x.Code == code) ?? throw new NotFoundException("ไม่พบ code");
		return result;
	}


	public async Task<mtPrivilege> GetById(Guid id)
	{
		var result = await Db.FirstOrDefaultAsync(x => x.PID == id) ?? throw new NotFoundException("ไม่พบ privilege");
		return result;
	}

	public async Task<mtPrivilegeItem> GetPrivilegeItemById(Guid ptid)
	{
		var result = await Context.PrivilegeItems.FirstOrDefaultAsync(x => x.PTID == ptid) ?? throw new NotFoundException("ไม่พบ privelegeitem");
		return result;
	}


	public async Task UpdatePrivilegeItem(Guid pid, List<mtPrivilegeItem> privilegeitem)
	{
		var pitem = await Context.PrivilegeItems.AsTracking().Where(x => x.PID == pid).ToListAsync();

		foreach (var item in pitem)
		{
			item.IsActive = false;
		}
		var privilege = await GetById(pid) ?? throw new NotFoundException("ไม่พบข้อมูล Privilege");

		foreach (var item in privilegeitem)
		{
			var opi = pitem.FirstOrDefault(x => x.PTID == item.PTID && x.PID == pid) ?? throw new NotFoundException("ไม่พบข้อมูล PrivilegeItem");
			if (opi != null)
			{
				opi.IsActive = true;
				continue;
			}
			var np = new mtPrivilegeItem()
			{
				PTID = item.PTID,
				PID = pid,
				mtPrivilege = privilege,
				Name = item.Name,
				Description = item.Description,
				Code = item.Code,
				IsActive = item.IsActive
			};
			await Context.PrivilegeItems.AddAsync(np);
		}
	}

	public async Task UpdatePrivilegeItem(Guid rid, List<Guid> privilegeitem)
	{
		var roleprivilegeitem = await Context.RolePrivilegesItem.AsTracking().Where(x => x.RID == rid).ToListAsync();
		var role = await Context.Roles.FirstOrDefaultAsync(x => x.RID == rid) ?? throw new NotFoundException("ไม่พบ Role");
		foreach (var item in roleprivilegeitem)
		{
			item.IsActive = false;
		}
		var newpr = new List<trRolePrivilegeItem>();
		var roleprivilage = roleprivilegeitem.Where(x => x.RID == rid).ToList();
		Context.RolePrivilegesItem.RemoveRange(roleprivilage);
		var items = await Context.PrivilegeItems
		.Where(p => privilegeitem.Contains(p.PTID))
		.ToListAsync();

		var newItems = items
				.Where(p => !roleprivilegeitem.Any(x => x.RID == rid && x.PTID == p.PTID))
				.Select(p => new trRolePrivilegeItem
				{
					RID = rid,
					PTID = p.PTID,
					IsActive = true
				})
				.ToList();

		await Context.RolePrivilegesItem.AddRangeAsync(newItems);
	}

	public async Task UpdatePrivilegeItem(Guid rid, List<Guid> privilegeitem, bool isactive)
	{
		var roleprivilegeitem = await Context.RolePrivilegesItem.AsTracking().Where(x => x.RID == rid).ToListAsync();
		var role = await Context.Roles.FirstOrDefaultAsync(x => x.RID == rid) ?? throw new NotFoundException("ไม่พบ Role");
		foreach (var item in roleprivilegeitem)
		{
			item.IsActive = false;
		}
		var newpr = new List<trRolePrivilegeItem>();
		foreach (var item in privilegeitem)
		{
			var pitem = await Context.PrivilegeItems.FirstOrDefaultAsync(x => x.PTID == item) ?? throw new NotFoundException("ไม่พบข้อมูล PrivilegeItem");
			var orp = roleprivilegeitem.FirstOrDefault(x => x.RID == rid && x.PTID == item);
			if (orp != null)
			{
				orp.IsActive = isactive;
				continue;
			}
		}
	}
}
