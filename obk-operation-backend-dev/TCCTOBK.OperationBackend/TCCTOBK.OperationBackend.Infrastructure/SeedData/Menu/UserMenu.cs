using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class UserMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("15156413-ca2d-4b3a-8c1e-e7019ca2ca35"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 100
	};

	public static mtMenu UserGroup = new()
	{
		Id = new Guid("b1b3907e-503c-408d-911b-32d7f6450694"),
		PTID = PrivilegeSeedData.UU000.PTID,
		ParentId = Group.Id,
		IconName = "SvgUser",
		Label = "Users",
		Type = MenuType.GROUP,
		DisplayOrder = 101,
	};

	public static mtMenu UserAll = new()
	{
		Id = new Guid("20104da5-004f-4fdb-9987-8603cf49959a"),
		Label = "All Users",
		To = "/users/all",
		ParentId = UserGroup.Id,
		Type = MenuType.LIST,
		DisplayOrder = 102,
		PTID = PrivilegeSeedData.UU001.PTID
	};
}
