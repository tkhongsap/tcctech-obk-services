using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class SustainabilityMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("1c8d8a4f-23f3-4c6c-bb10-948c6e14dc09"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 1000
	};

	public static mtMenu SustainGroup = new()
	{
		Id = new Guid("eac1e712-1f6c-4b20-bf47-fdb593c69b36"),
		Label = "Sustainability",
		ParentId = Group.Id,
		IconName = "SvgSustainability",
		Visible = true,
		DisplayOrder = 1001,
		PTID = PrivilegeSeedData.ST000.PTID,
		Type = MenuType.EDIT
	};

	public static mtMenu PRBanner = new()
	{
		Id = new Guid("6103a7fc-8362-4daf-9d43-ec8c9b39813e"),
		Label = "PR Banner",
		To = "/sustainability/prbanner",
		ParentId = SustainGroup.Id,
		Visible = true,
		DisplayOrder = 1002,
		PTID = PrivilegeSeedData.ST002.PTID,
		Type = MenuType.LIST
	};

	public static mtMenu PRBannerCreate = new()
	{
		Id = new Guid("b38bd9d0-d315-4bfd-b8c1-c23f38265587"),
		Label = "Create PR Banner",
		To = "/sustainability/prbanner/create",
		ParentId = PRBanner.Id,
		Visible = false,
		DisplayOrder = 1003,
		PTID = PrivilegeSeedData.ST008.PTID,
		Type = MenuType.CREATE
	};

	public static mtMenu PRBannerEdit = new()
	{
		Id = new Guid("be549187-a15c-4951-a983-a37a64c195b3"),
		Label = "Edit PR Banner",
		To = "/sustainability/prbanner/edit/:id",
		ParentId = PRBanner.Id,
		Visible = false,
		DisplayOrder = 1004,
		PTID = PrivilegeSeedData.ST003.PTID,
		Type = MenuType.EDIT
	};

	public static mtMenu Banner = new()
	{
		Id = new Guid("366e47bb-895a-4157-8d2d-d474fcfcbed6"),
		Label = "Banner Management",
		To = "/sustainability/banner",
		ParentId = SustainGroup.Id,
		Visible = true,
		DisplayOrder = 1005,
		PTID = PrivilegeSeedData.ST001.PTID,
		Type = MenuType.LIST
	};

	public static mtMenu Library = new()
	{
		Id = new Guid("d3e796c4-54db-4cad-9d15-ebc3d7759dcf"),
		Label = "Digital Library",
		To = "/sustainability/library",
		ParentId = SustainGroup.Id,
		Visible = true,
		DisplayOrder = 1006,
		PTID = PrivilegeSeedData.ST006.PTID,
		Type = MenuType.LIST
	};

	public static mtMenu LibraryCreate = new()
	{
		Id = new Guid("5b0a2540-56d0-416d-a346-cca2ca96f828"),
		Label = "Create Digital Library",
		To = "/sustainability/library/create",
		ParentId = Library.Id,
		Visible = false,
		DisplayOrder = 1007,
		PTID = PrivilegeSeedData.ST011.PTID,
		Type = MenuType.CREATE
	};

	public static mtMenu LibraryEdit = new()
	{
		Id = new Guid("db52ec33-64d6-43d9-a13b-38cf09c1792f"),
		Label = "Edit Digital Library",
		To = "/sustainability/library/edit/:id",
		ParentId = Library.Id,
		Visible = false,
		DisplayOrder = 1008,
		PTID = PrivilegeSeedData.ST007.PTID,
		Type = MenuType.EDIT
	};

	public static mtMenu ContentManagement = new()
	{
		Id = new Guid("5ae35f75-2b89-4ae3-bb85-c3e4b85f7627"),
		Label = "Content Management",
		To = "/sustainability/all",
		ParentId = SustainGroup.Id,
		Visible = true,
		DisplayOrder = 1009,
		PTID = PrivilegeSeedData.ST004.PTID,
		Type = MenuType.LIST
	};

	public static mtMenu ContentManagementCreate = new()
	{
		Id = new Guid("169891fe-97c7-4181-83e2-1f2045f66f14"),
		Label = "Create Content Management",
		To = "/sustainability/all/create",
		ParentId = ContentManagement.Id,
		Visible = false,
		DisplayOrder = 1010,
		PTID = PrivilegeSeedData.ST009.PTID,
		Type = MenuType.CREATE
	};

	public static mtMenu ContentManagementEdit = new()
	{
		Id = new Guid("ff3680b5-6fc2-4453-af50-733197029825"),
		Label = "Edit Content Management",
		To = "/sustainability/all/edit/:id",
		ParentId = ContentManagement.Id,
		Visible = false,
		DisplayOrder = 1011,
		PTID = PrivilegeSeedData.ST005.PTID,
		Type = MenuType.EDIT
	};

	public static mtMenu ContentManagementSub = new()
	{
		Id = new Guid("58aa403f-72d4-41a5-9737-41a686e107bb"),
		Label = "Sub Content Management",
		To = "/sustainability/all/show/:id",
		ParentId = SustainGroup.Id,
		Visible = false,
		DisplayOrder = 1012,
		PTID = PrivilegeSeedData.ST010.PTID,
		Type = MenuType.LIST
	};
}
