using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;
internal class MenuRepository : BaseRepository<mtMenu>, IMenuRepository
{
	public MenuRepository(ITCCTOBKContext context) : base(context)
	{
	}

	public async Task<List<mtMenu>> GetMenuByRole(string keyCloakUserId, Guid csid)
	{
		var privilegeItemsId = await Context.RoleMembers.Where(x => x.taMember.KeyCloakUserId == keyCloakUserId && x.IsActive && x.trRole.IsActive && x.trRole.IsDelete != true && x.trRole.CSID == csid).Include(x => x.trRole).ThenInclude(x => x.trRolePrivilagesItem).ThenInclude(x => x.mtPrivilegeItem).SelectMany(x => x.trRole.trRolePrivilagesItem).Select(x => x.mtPrivilegeItem.PTID).ToListAsync();
		return await Db
			.Where(x => (x.PTID == null || (x.PTID != null && privilegeItemsId.Contains(x.PTID.Value))))
			.OrderBy(x => x.DisplayOrder).ToListAsync();
		//TODO Change to get from db.
		//return SeedData.MenuSeedData.Data.Where(x => x.PTID == null || (x.PTID != null && privilegeItemsId.Contains(x.PTID.Value))).OrderBy(x => x.DisplayOrder).ToList();
	}
}
