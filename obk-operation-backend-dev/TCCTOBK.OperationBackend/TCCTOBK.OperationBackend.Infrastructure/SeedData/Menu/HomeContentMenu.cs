using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class HomeContentMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("4ebf89eb-7619-4c86-a4ed-f613bee88b96"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 200
	};

	public static mtMenu HomeContentGroup = new()
	{
		Id = new Guid("76f83971-19bf-4274-917e-171f6349c3f4"),
		IconName = "SvgContent",
		ParentId = Group.Id,
		Label = "Home content",
		Header = "Home content",
		DisplayOrder = 201,
		PTID = PrivilegeSeedData.HC000.PTID
	};

	public static mtMenu EditContent = new()
	{
		Id = new Guid("ee5edac7-3796-4d1e-9055-5087b524aa8f"),
		Label = "Edit content",
		Header = "Home content",
		DisplayOrder = 202,
		To = "/home-content/edit-content",
		Breadcrumb = "[\"Home content\"]",
		ParentId = HomeContentGroup.Id,
		PTID = PrivilegeSeedData.HC002.PTID
	};

	public static mtMenu VersionHistory = new()
	{
		Id = new Guid("34eec0b9-219d-4172-a4ed-b272953d9151"),
		Label = "Version history",
		Header = "Home content",
		DisplayOrder = 203,
		To = "/home-content/version-history",
		Breadcrumb = "[\"Home content\"]",
		ParentId = HomeContentGroup.Id,
	};

	public static mtMenu VersionHistoryShow = new()
	{
		Id = new Guid("257eb503-acf4-49a0-a92b-9d057d586399"),
		Label = "Version history",
		Header = "History Log",
		DisplayOrder = 204,
		Type = MenuType.SHOW,
		To = "/home-content/version-history/show/:id",
		Breadcrumb = "[\"Home content\"]",
		ParentId = VersionHistory.Id,
		Visible = false,
	};
}
