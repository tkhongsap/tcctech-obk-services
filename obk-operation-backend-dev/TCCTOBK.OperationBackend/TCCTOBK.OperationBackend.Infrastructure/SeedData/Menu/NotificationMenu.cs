using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class NotificationMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("84bf146b-86c5-4b51-8829-226a3dd475c1"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 300
	};
	public static mtMenu NotificationGroup = new()
	{
		Id = new Guid("119e8afe-263c-4219-9d33-67825b221dd5"),
		ParentId = Group.Id,
		Label = "Notifications",
		Header = "Notifications",
		IconName = "SvgBell",
		Visible = true,
		DisplayOrder = 301,
		PTID = PrivilegeSeedData.NT000.PTID
	};
	// Notification Inapp
	public static mtMenu InApp = new()
	{
		Id = new Guid("c3038f9f-7742-4b1e-9287-f540e208b586"),
		Label = "In-apps notifications",
		Header = "In-apps notifications",
		To = "/notifications/inapp",
		ParentId = NotificationGroup.Id,
		Breadcrumb = "[\"Notifications\"]",
		Visible = true,
		DisplayOrder = 302,
		PTID = PrivilegeSeedData.NT001.PTID

	};
	public static mtMenu InAppShow = new()
	{
		Id = new Guid("c6328155-2278-4e0c-8765-f6e6ca951055"),
		Label = "In-apps notifications",
		Header = "View in-app notification",
		To = "/notifications/inapp/show/:id",
		ParentId = InApp.Id,
		Breadcrumb = "[\"Notifications\",\"In-apps notifications\"]",
		Visible = false,
		DisplayOrder = 303,
		PTID = PrivilegeSeedData.NT001.PTID,
		Type = MenuType.SHOW
	};
	public static mtMenu InAppCreate = new()
	{
		Id = new Guid("dfb26e2d-336e-49cb-9162-bd933453c67c"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "In-apps notifications",
		Header = "Create new in-app notification",
		To = "/notifications/inapp/create-inapp",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 304,
		Type = MenuType.CREATE
	};
	public static mtMenu InAppAnnouncement = new()
	{
		Id = new Guid("40f7997c-a807-4dd5-9207-5a37d5894175"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "In-apps notifications",
		Header = "Create new Announcement",
		To = "/notifications/inapp/create-announcement",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 304,
		Type = MenuType.CREATE
	};
	public static mtMenu InAppDuplicate = new()
	{
		Id = new Guid("e5e64ccf-7f86-4896-9e4c-e5ef6720732e"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "In-apps notifications",
		Header = "Create new in-app notification",
		To = "/notifications/inapp/create-inapp/duplicate/:id",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 304,
		Type = MenuType.CREATE
	};
	public static mtMenu InAppAnnouncementDuplicate = new()
	{
		Id = new Guid("25136f0a-b0b1-4b56-a8e7-0cccefa8025b"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "In-apps notifications",
		Header = "Create new Announcement",
		To = "/notifications/inapp/create-announcement/duplicate/:id",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 304,
		Type = MenuType.CREATE
	};
	public static mtMenu InAppCreateTemplate = new()
	{
		Id = new Guid("cecdbe9e-639f-40cc-abd1-7fa588904d2e"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "In-apps notifications",
		Header = "Create new in-app notification",
		To = "/notifications/inapp/create-inapp/template/:id",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 304,
		Type = MenuType.CREATE
	};
	public static mtMenu InAnnouncementCreateTemplate = new()
	{
		Id = new Guid("72178f6f-99b2-4a32-9e45-a296dcdb025e"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "In-apps notifications",
		Header = "Create new announcement",
		To = "/notifications/inapp/create-announcement/template/:id",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 304,
		Type = MenuType.CREATE
	};
	public static mtMenu InAppEdit = new()
	{
		Id = new Guid("e5afae2f-6fa5-4bfb-a5bc-963c9c3713fb"),
		Label = "In-apps notifications",
		Header = "In-apps notifications",
		To = "/notifications/inapp/edit/:id",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 305,
		Type = MenuType.EDIT
	};
	public static mtMenu AnnouncementEdit = new()
	{
		Id = new Guid("b15a2f26-0cc2-44a8-9fea-52a43a20ca29"),
		Label = "Edit announcement",
		Header = "Edit announcement",
		To = "/notifications/inapp/edit-announcement/:id",
		ParentId = InApp.Id,
		Visible = false,
		DisplayOrder = 305,
		Type = MenuType.EDIT
	};
	// Notification Draft
	public static mtMenu Draft = new()
	{
		Id = new Guid("293a2e71-278a-4c95-bdd4-a3b9dbd8e13c"),
		Label = "Draft(s)",
		Header = "Draft(s)",
		To = "/notifications/draft",
		ParentId = NotificationGroup.Id,
		Visible = true,
		DisplayOrder = 306,
		PTID = PrivilegeSeedData.NT003.PTID,
		Type = MenuType.LIST
	};
	// Notification Template
	public static mtMenu Template = new()
	{
		Id = new Guid("9715e820-19ca-48fc-b4a4-5e5c6d193bc1"),
		Label = "Templates",
		Header = "Templates",
		To = "/notifications/template",
		ParentId = NotificationGroup.Id,
		Visible = true,
		DisplayOrder = 307,
		PTID = PrivilegeSeedData.NT005.PTID,
		Type = MenuType.LIST
	};
	public static mtMenu TemplateShow = new()
	{
		Id = new Guid("f340108d-2384-409a-b3ae-80d21ba6134c"),
		Label = "View in-app template notification template",
		Header = "View in-app template notification template",
		To = "/notifications/template/show/:id",
		ParentId = Template.Id,
		Breadcrumb = "[\"Notifications\",\"In-apps template notifications\"]",
		Visible = false,
		DisplayOrder = 308,
		PTID = PrivilegeSeedData.NT005.PTID,
		Type = MenuType.SHOW
	};
	public static mtMenu TemplateCreate = new()
	{
		Id = new Guid("b1411131-4f55-4d9d-8910-3daf76c26dc1"),
		Label = "Create new in-apps notification template",
		Header = "Create new in-apps notification template",
		To = "/notifications/template/create-inapp",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 309,
		PTID = PrivilegeSeedData.NT006.PTID,
		Type = MenuType.CREATE
	};
	public static mtMenu TemaplateAnnouncement = new()
	{
		Id = new Guid("e7806d02-a603-47f0-9bb6-2b0aaa852869"),
		Label = "Create new announcement template",
		Header = "Create new announcement template",
		To = "/notifications/template/create-announcement",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 310,
		Type = MenuType.LIST
	};
	public static mtMenu TemplateCreateFromCampaign = new()
	{
		Id = new Guid("c965d9bd-6f96-4fa6-9422-3b4c6d0930d8"),
		Label = "Create new in-apps notification template",
		Header = "Create new in-apps notification template",
		To = "/notifications/template/create-inapp/campaign/:id",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 309,
		PTID = PrivilegeSeedData.NT006.PTID,
		Type = MenuType.CREATE
	};
	public static mtMenu TemaplateAnnouncementFromCampaign = new()
	{
		Id = new Guid("9debbc29-17a3-4753-9edd-edda1292a340"),
		Label = "Create new announcement template",
		Header = "Create new announcement template",
		To = "/notifications/template/create-announcement/campaign/:id",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 310,
		Type = MenuType.LIST
	};
	public static mtMenu TemplateEdit = new()
	{
		Id = new Guid("9c16bb6a-2798-4da7-916d-ef91a917dcd1"),
		Label = "In-apps edit template notifications",
		Header = "In-apps edit template notifications",
		To = "/notifications/template/edit/:id",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 311,
		PTID = PrivilegeSeedData.NT006.PTID,
		Type = MenuType.EDIT,
	};
	public static mtMenu TemplateAnnouncementEdit = new()
	{
		Id = new Guid("1a920071-d382-4a87-9626-7ca1c78ead44"),
		Label = "Edit Announcement template",
		Header = "Edit Announcement template",
		To = "/notifications/template/edit-announcement/:id",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 311,
		PTID = PrivilegeSeedData.NT006.PTID,
		Type = MenuType.EDIT,
	};
	// Notification Category
	public static mtMenu Category = new()
	{
		Id = new Guid("88874de1-34c6-40b5-895b-b8c68e0455bb"),
		Label = "Categories",
		Header = "Categories",
		To = "/notifications/categories",
		ParentId = NotificationGroup.Id,
		Visible = true,
		DisplayOrder = 311,
		PTID = PrivilegeSeedData.NT007.PTID,
		Type = MenuType.LIST,
	};
	public static mtMenu CategoryShow = new()
	{
		Id = new Guid("9b49ddba-1b9d-445b-a2c9-168dd1903dde"),
		Label = "Categories",
		Header = "Categories",
		To = "/notifications/categories/show/:id",
		ParentId = Category.Id,
		Breadcrumb = "[\"Notification\",\"Category\"]",
		Visible = false,
		DisplayOrder = 313,
		PTID = PrivilegeSeedData.NT007.PTID,
		Type = MenuType.SHOW,
	};
	public static mtMenu CategoryCreate = new()
	{
		Id = new Guid("6f9dcead-e770-476a-943f-c4606b3f36a8"),
		Label = "Create new category",
		Header = "Create new category",
		To = "/notifications/categories/create",
		ParentId = Category.Id,
		Breadcrumb = "[\"Notification\",\"Create new category\"]",
		Visible = false,
		DisplayOrder = 314,
		PTID = PrivilegeSeedData.NT008.PTID,
		Type = MenuType.CREATE,
	};
	public static mtMenu CategoryEdit = new()
	{
		Id = new Guid("234a02c1-b447-4e41-aa6f-64ce26e1d77c"),
		Label = "Edit category",
		Header = "Edit category",
		To = "/notifications/categories/edit/:id",
		ParentId = Category.Id,
		Breadcrumb = "[\"Notification\",\"Edit category\"]",
		Visible = false,
		DisplayOrder = 315,
		PTID = PrivilegeSeedData.NT008.PTID,
		Type = MenuType.EDIT,
	};
}
