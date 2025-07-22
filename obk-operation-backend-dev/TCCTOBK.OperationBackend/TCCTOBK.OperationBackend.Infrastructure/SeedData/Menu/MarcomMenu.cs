using System;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;

internal static class MarcomMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("31038a00-a731-4e91-b1e1-2de9e9479a56"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 150
	};

	public static mtMenu MarcomGroup = new()
	{
		Id = new Guid("34481ce3-583e-4ad3-9411-dbe319f7ba3e"),
		IconName = "SvgContent",
		ParentId = Group.Id,
		Label = "Marcom",
		Header = "Marcom",
		DisplayOrder = 152,
		Visible = true,
		// TODO Change privilege
		PTID = PrivilegeSeedData.MC000.PTID
	};

	public static mtMenu HeroBanner = new()
	{
		Id = new Guid("5b5be629-2886-4c70-8864-ad4fa650df0a"),
		Label = "Hero Banner",
		To = "/marcom/hero",
		ParentId = MarcomGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 161,
		PTID = PrivilegeSeedData.MC001.PTID
	};

	public static mtMenu HeroBannerCreate = new()
	{
		Id = new Guid("e3bfce6b-dc41-4dbe-a9e8-d43cbe69cae6"),
		Label = "Create Hero Banner",
		To = "/marcom/hero/create",
		ParentId = HeroBanner.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 162,
		PTID = PrivilegeSeedData.MC002.PTID
	};

	public static mtMenu HeroBannerEdit = new()
	{
		Id = new Guid("95c3bef9-94aa-40e7-858b-c0d1a4e26b48"),
		Label = "Edit Hero Banner",
		To = "/marcom/hero/edit/:id",
		ParentId = HeroBanner.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 163,
		PTID = PrivilegeSeedData.MR003.PTID
	};

	public static mtMenu WhatHappening = new()
	{
		Id = new Guid("c0a62684-d85a-4b8a-bbb7-8d7d55b3c049"),
		Label = "What's Happening",
		To = "/marcom/happening",
		ParentId = MarcomGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 171,
		PTID = PrivilegeSeedData.MC010.PTID
	};

	public static mtMenu WhatHappeningCreate = new()
	{
		Id = new Guid("292462da-4d95-4189-94f0-8414fc42d303"),
		Label = "Create What's Happening",
		To = "/marcom/happening/create",
		ParentId = WhatHappening.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 172,
		PTID = PrivilegeSeedData.MC011.PTID
	};

	public static mtMenu WhatHappeningEdit = new()
	{
		Id = new Guid("bfef882e-682b-4753-b9f3-c7ec3f3acb46"),
		Label = "Edit What's Happening",
		To = "/marcom/happening/edit/:id",
		ParentId = WhatHappening.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 173,
		PTID = PrivilegeSeedData.MC012.PTID
	};

	public static mtMenu WhatHappeningShow = new()
	{
		Id = new Guid("56f8419c-e36e-4dc9-8ac9-25261174f50b"),
		Label = "Article What's Happening",
		To = "/marcom/happening/show/:id",
		ParentId = WhatHappening.Id,
		Visible = false,
		Type = MenuType.SHOW,
		DisplayOrder = 174,
		PTID = PrivilegeSeedData.MC013.PTID
	};

	public static mtMenu ExploreOneBangkok = new()
	{
		Id = new Guid("d234f890-4b27-45d8-9fa7-9c8b014b5f4b"),
		Label = "Explore One Bangkok",
		To = "/marcom/explore",
		ParentId = MarcomGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 182,
		PTID = PrivilegeSeedData.MC007.PTID
	};

	public static mtMenu ExploreOneBangkokCreate = new()
	{
		Id = new Guid("7f03b134-cc4a-475b-84f3-a3ebc6521103"),
		Label = "Create Explore One Bangkok",
		To = "/marcom/explore/create",
		ParentId = ExploreOneBangkok.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 184,
		PTID = PrivilegeSeedData.MC008.PTID
	};

	public static mtMenu ExploreOneBangkokEdit = new()
	{
		Id = new Guid("054dac0c-1636-40f3-9120-4996b5c7c65e"),
		Label = "Edit Explore One Bangkok",
		To = "/marcom/explore/edit/:id",
		ParentId = ExploreOneBangkok.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 185,
		PTID = PrivilegeSeedData.MC009.PTID
	};

	public static mtMenu SpecialEvent = new()
	{
		Id = new Guid("0ea4b40d-2bce-4e9b-8ec2-13de9e36a228"),
		Label = "Special Event",
		To = "/marcom/event",
		ParentId = MarcomGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 182,
		PTID = PrivilegeSeedData.MC004.PTID
	};

	public static mtMenu SpecialEventCreate = new()
	{
		Id = new Guid("4eeaf585-c62c-4e44-8e49-0f58daa6b6d1"),
		Label = "Special Event",
		To = "/marcom/event/create",
		ParentId = SpecialEvent.Id,
		Visible = false,
		Type = MenuType.CREATE,
		DisplayOrder = 184,
		PTID = PrivilegeSeedData.MC005.PTID
	};

	public static mtMenu SpecialEventEdit = new()
	{
		Id = new Guid("54f6ea7d-cc01-45a2-a68e-48d22dfdf01d"),
		Label = "Special Event",
		To = "/marcom/event/edit/:id",
		ParentId = SpecialEvent.Id,
		Visible = false,
		Type = MenuType.EDIT,
		DisplayOrder = 185,
		PTID = PrivilegeSeedData.MC006.PTID
	};
}

