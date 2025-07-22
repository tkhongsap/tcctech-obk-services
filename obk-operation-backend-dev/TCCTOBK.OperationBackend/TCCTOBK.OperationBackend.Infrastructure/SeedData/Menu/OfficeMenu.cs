using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;

internal static class OfficeMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("3d1cf108-2efd-4dcc-bb67-13b054e72a18"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 200
	};

	public static mtMenu OfficeGroup = new()
	{
		Id = new Guid("994bbf11-10bf-411f-b395-27c3561ade9b"),
		IconName = "SvgOffice",
		ParentId = Group.Id,
		Label = "Office",
		Header = "Office",
		DisplayOrder = 201,
		Visible = true,
		PTID = PrivilegeSeedData.OF000.PTID
	};

	public static mtMenu EditContent = new()
	{
		Id = new Guid("27801834-36e4-4fec-9750-aa4ff498063a"),
		Label = "Home content",
		Header = "Home content",
		DisplayOrder = 202,
		To = "/home-content/edit-content",
		Breadcrumb = "[\"Home content\"]",
		ParentId = OfficeGroup.Id,
		PTID = PrivilegeSeedData.OF001.PTID
	};

	public static mtMenu WhatHappening = new()
	{
		Id = new Guid("74a9aaf6-32d6-431f-a1e7-68d041dc1f1f"),
		Label = "What's Happening",
		Header = "What's Happening",
		Breadcrumb = "[\"Office\"]",
		To = "/what-happening",
		ParentId = OfficeGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 203,
		PTID = PrivilegeSeedData.OF002.PTID
	};

	public static mtMenu WhatHappeningCreate = new()
	{
		Id = new Guid("dc0b252a-e9b2-458c-b2be-23d6a063e882"),
		Label = "Emergency Contact",
		Header = "Emergency Contact",
		Breadcrumb = "[\"Office\"]",
		To = "/emergency-contact",
		ParentId = WhatHappening.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 204,
		PTID = PrivilegeSeedData.OF002.PTID
	};

	public static mtMenu WhatHappeningEdit = new()
	{
		Id = new Guid("cd06d2c3-a8e1-4c10-b70e-8bb7348a1d7f"),
		Label = "Emergency Contact",
		Header = "Emergency Contact",
		Breadcrumb = "[\"Office\"]",
		To = "/emergency-contact",
		ParentId = WhatHappening.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 205,
		PTID = PrivilegeSeedData.OF005.PTID
	};

	public static mtMenu WhatHappeningShow = new()
	{
		Id = new Guid("41587cf4-5588-46c7-bd79-5f04bc337b80"),
		Label = "Emergency Contact",
		Header = "Emergency Contact",
		Breadcrumb = "[\"Office\"]",
		To = "/emergency-contact",
		ParentId = WhatHappening.Id,
		Visible = false,
		Type = MenuType.SHOW,
		DisplayOrder = 206,
		PTID = PrivilegeSeedData.OF002.PTID
	};

	public static mtMenu VersionHistory = new()
	{
		Id = new Guid("d65f958d-a3ab-45f9-9b34-99c362376eb5"),
		Label = "Version history",
		Header = "Home content",
		DisplayOrder = 207,
		To = "/home-content/version-history",
		Breadcrumb = "[\"Home content\"]",
		ParentId = OfficeGroup.Id,
		PTID = PrivilegeSeedData.OF003.PTID
	};

	public static mtMenu VersionHistoryShow = new()
	{
		Id = new Guid("8ad532c7-1cdd-4f35-8a40-4a13cf0bb60c"),
		Label = "Version history",
		Header = "History Log",
		DisplayOrder = 208,
		Type = MenuType.SHOW,
		To = "/home-content/version-history/show/:id",
		Breadcrumb = "[\"Home content\"]",
		ParentId = VersionHistory.Id,
		Visible = false,
		PTID = PrivilegeSeedData.OF003.PTID
	};

	public static mtMenu DirectoryContact = new()
	{
		Id = new Guid("85dbfe62-ca8c-472c-a33c-3f2dd43fe3d9"),
		Label = "Directory Contact",
		Header = "Directory Contact",
		Breadcrumb = "[\"Office\"]",
		To = "/directory-contact",
		ParentId = OfficeGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 209,
		PTID = PrivilegeSeedData.OF004.PTID
	};

	public static mtMenu DirectoryContactShow = new()
	{
		Id = new Guid("e856099a-4ef5-4b2d-8fe1-df5f5c975b3a"),
		Label = "Directory Contact",
		Header = "Directory Contact",
		Breadcrumb = "[\"Office\"]",
		To = "/directory-contact/show",
		ParentId = DirectoryContact.Id,
		Visible = false,
		Type = MenuType.SHOW,
		DisplayOrder = 210,
		PTID = PrivilegeSeedData.OF004.PTID
	};

	public static mtMenu DirectoryContactCreate = new()
	{
		Id = new Guid("fec611d1-a66e-4193-8f73-d7a982f89edb"),
		Label = "Directory Contact",
		Header = "Directory Contact",
		Breadcrumb = "[\"Office\"]",
		To = "/directory-contact/create",
		ParentId = DirectoryContact.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 211,
		PTID = PrivilegeSeedData.OF004.PTID
	};

	public static mtMenu DirectoryContactEdit = new()
	{
		Id = new Guid("c078d178-96f5-4aee-b6b9-a64d339ee6aa"),
		Label = "Directory Contact",
		Header = "Directory Contact",
		Breadcrumb = "[\"Office\"]",
		To = "/directory-contact/edit/:id",
		ParentId = DirectoryContact.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 212,
		PTID = PrivilegeSeedData.OF004.PTID
	};

	public static mtMenu EmergencyContact = new()
	{
		Id = new Guid("62ff1523-5536-4baa-87b0-9d702d65ce48"),
		Label = "Personal Escort",
		Header = "Personal Escort",
		Breadcrumb = "[\"Office\"]",
		To = "/personal-escort",
		ParentId = OfficeGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 213,
		PTID = PrivilegeSeedData.OF005.PTID
	};
}

