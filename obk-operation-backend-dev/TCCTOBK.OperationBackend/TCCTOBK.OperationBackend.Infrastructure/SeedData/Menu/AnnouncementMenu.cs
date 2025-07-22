using System;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;

internal static class AnnouncementMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("e355a5c7-3019-4bcf-a280-339082fd1b91"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 350
	};

	public static mtMenu AnnouncementGroup = new()
	{
		Id = new Guid("75a49b0c-2a50-4e2c-80bd-11fb8483a223"),
		IconName = "SvgAnnouncement",
		ParentId = Group.Id,
		Label = "Announcements",
		Header = "Announcements",
		DisplayOrder = 351,
		Visible = true,
		// TODO Change privilege
		PTID = PrivilegeSeedData.HC000.PTID
	};

	public static mtMenu Announcements = new()
	{
		Id = new Guid("26346b6d-2525-44c6-9809-3cd75442a749"),
		Label = "Announcements List",
		Header = "Announcements",
		To = "/announcements",
		ParentId = AnnouncementGroup.Id,
		Breadcrumb = "[\"Announcements\"]",
		Visible = true,
		DisplayOrder = 352,
		Type = MenuType.LIST,
		PTID = PrivilegeSeedData.NT001.PTID,
	};

	public static mtMenu AnnouncementCreate = new()
	{
		Id = new Guid("2e60d46b-4f19-4936-ab53-e2dbe477c20a"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "Announcements",
		Header = "Create new Announcement",
		To = "/announcements/inapp/create-announcement",
		ParentId = Announcements.Id,
		Visible = false,
		DisplayOrder = 353,
		Type = MenuType.CREATE
	};
	public static mtMenu AnnouncementEdit = new()
	{
		Id = new Guid("543dd90c-41e2-4e6d-be38-354f374478cc"),
		Label = "Edit announcement",
		Header = "Edit announcement",
		To = "/notifications/inapp/edit-announcement/:id",
		ParentId = Announcements.Id,
		Visible = false,
		DisplayOrder = 354,
		Type = MenuType.EDIT
	};
	public static mtMenu InAnnouncementCreateTemplate = new()
	{
		Id = new Guid("a603058e-6453-408d-b6b8-c97a1fd6ebf6"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "Announcements",
		Header = "Create new announcement",
		To = "/notifications/inapp/create-announcement/template/:id",
		ParentId = Announcements.Id,
		Visible = false,
		DisplayOrder = 355,
		Type = MenuType.CREATE
	};
	public static mtMenu InAppAnnouncementDuplicate = new()
	{
		Id = new Guid("0470df74-a574-41c2-83de-455084f890c1"),
		PTID = new Guid("9bfe9f97-205d-4a4d-8b7b-c0a75e3485dd"),
		Label = "In-apps notifications",
		Header = "Create new Announcement",
		To = "/notifications/inapp/create-announcement/duplicate/:id",
		ParentId = Announcements.Id,
		Visible = false,
		DisplayOrder = 356,
		Type = MenuType.CREATE
	};
	// Announcement Draft
	public static mtMenu Draft = new()
	{
		Id = new Guid("9fc90de3-34ce-4a0d-9bf6-5238887035cd"),
		Label = "Draft(s)",
		Header = "Draft(s)",
		To = "/announcements/draft",
		ParentId = AnnouncementGroup.Id,
		Visible = true,
		DisplayOrder = 357,
		PTID = PrivilegeSeedData.NT003.PTID,
		Type = MenuType.LIST
	};
	// Announcement Template
	public static mtMenu Template = new()
	{
		Id = new Guid("7b6043ce-23d9-4c85-810a-110bad5dc0fc"),
		Label = "Templates",
		Header = "Templates",
		To = "/announcements/template",
		ParentId = AnnouncementGroup.Id,
		Visible = true,
		DisplayOrder = 358,
		PTID = PrivilegeSeedData.NT005.PTID,
		Type = MenuType.LIST
	};
	public static mtMenu TemaplateAnnouncement = new()
	{
		Id = new Guid("2fe6306e-8491-44a3-9f73-97981c57dc6b"),
		Label = "Create new announcement template",
		Header = "Create new announcement template",
		To = "/notifications/template/create-announcement",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 359,
		Type = MenuType.CREATE
	};
	public static mtMenu TemaplateAnnouncementFromCampaign = new()
	{
		Id = new Guid("daa99959-be57-4566-9c70-d53f928d9587"),
		Label = "Create new announcement template",
		Header = "Create new announcement template",
		To = "/notifications/template/create-announcement/campaign/:id",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 360,
		Type = MenuType.CREATE
	};
	public static mtMenu TemplateAnnouncementEdit = new()
	{
		Id = new Guid("4a518b6f-4ad3-486e-89ce-8992db5ab7cd"),
		Label = "Edit Announcement template",
		Header = "Edit Announcement template",
		To = "/notifications/template/edit-announcement/:id",
		ParentId = Template.Id,
		Visible = false,
		DisplayOrder = 361,
		PTID = PrivilegeSeedData.NT006.PTID,
		Type = MenuType.EDIT,
	};
}
