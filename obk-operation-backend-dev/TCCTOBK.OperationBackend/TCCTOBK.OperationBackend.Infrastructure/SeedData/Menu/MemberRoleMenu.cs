using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class MemberRoleMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("1072eee8-2707-49e4-8131-83457b8edce8"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 700
	};

	public static mtMenu MemberRoleGroup = new()
	{
		Id = new Guid("22743885-cf89-4009-8ca6-01049a2dba36"),
		Label = "Members & Roles",
		ParentId = Group.Id,
		Header = "Members & Roles",
		IconName = "SvgRole",
		Visible = true,
		Type = MenuType.GROUP,
		DisplayOrder = 701,
		PTID = PrivilegeSeedData.MR000.PTID
	};

	public static mtMenu MemberManagement = new()
	{
		Id = new Guid("f9720e30-bc8f-49aa-a31a-d51ef69422a3"),
		Label = "Member management",
		Header = "Member management",
		Breadcrumb = "[\"Members & Roles\"]",
		To = "/roles/member",
		ParentId = MemberRoleGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 702,
		PTID = PrivilegeSeedData.MR001.PTID
	};

	public static mtMenu MemberManagementCreate = new()
	{
		Id = new Guid("d0fbe2f6-2973-4cba-91a1-680dd86d72bc"),
		Label = "Invite Member",
		Header = "Invite member",
		Breadcrumb = "[\"Members & Roles\",\"Member management\"]",
		To = "/roles/member/create",
		ParentId = MemberManagement.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 703,
		PTID = PrivilegeSeedData.MR002.PTID
	};

	public static mtMenu MemberManagementEdit = new()
	{
		Id = new Guid("699415f6-01a2-4556-9734-2e918c2748d7"),
		Label = "Edit Member",
		Header = "Edit Member",
		Breadcrumb = "[\"Members & Roles\",\"Member management\"]",
		To = "/roles/member/edit/:id",
		ParentId = MemberManagement.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 704,
		PTID = PrivilegeSeedData.MR002.PTID
	};


	public static mtMenu RoleManagement = new()
	{
		Id = new Guid("274ca920-c069-4c41-9ee1-dcd499713e3d"),
		Label = "Role management",
		Header = "Role management",
		Breadcrumb = "[\"Members & Roles\"]",
		To = "/roles/role",
		ParentId = MemberRoleGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 705,
		PTID = PrivilegeSeedData.MR003.PTID
	};
	public static mtMenu RoleManagementCreate = new()
	{
		Id = new Guid("d4f29776-3f01-4dde-8c47-3f06735fe01b"),
		Label = "Create new role",
		Header = "Create new role",
		Breadcrumb = "[\"Members & Roles\",\"Role management\"]",
		To = "/roles/role/create",
		ParentId = RoleManagement.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 706,
		PTID = PrivilegeSeedData.MR004.PTID
	};
	public static mtMenu RoleManagementEdit = new()
	{
		Id = new Guid("6e0777ec-4958-402b-a374-b8e604fa8da7"),
		Label = "Edit role privileges",
		Header = "Edit role privileges",
		Breadcrumb = "[\"Members & Roles\",\"Role management\"]",
		To = "/roles/role/edit/:id",
		ParentId = RoleManagement.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 707,
		PTID = PrivilegeSeedData.MR004.PTID
	};

}
