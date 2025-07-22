using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class SupportMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("dc712dc0-9a6b-4b35-8c42-e2870deb804c"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 600
	};

	public static mtMenu SupportGroup = new()
	{
		Id = new Guid("2ad8b5cc-8189-4be0-ad71-6ae15b23b7e9"),
		Label = "Support",
		ParentId = Group.Id,
		IconName = "SvgSupport",
		Visible = true,
		DisplayOrder = 601,
		PTID = PrivilegeSeedData.AS000.PTID
	};

	public static mtMenu AccessLocalInformation = new()
	{
		Id = new Guid("05ab1003-7561-44d9-8721-c1117799e4ef"),
		Label = "Access Local Information",
		To = "/support/access-information",
		ParentId = SupportGroup.Id,
		Visible = true,
		Breadcrumb = "[\"Dashboard\",\"Support\",\"Access Local Information\"]",
		DisplayOrder = 602,
		PTID = PrivilegeSeedData.AS001.PTID
	};

	public static mtMenu Faq = new()
	{
		Id = new Guid("13b65779-5c92-4b76-9d46-41b743a585aa"),
		Label = "FAQs",
		To = "/support/faqs",
		ParentId = SupportGroup.Id,
		Visible = true,
		Breadcrumb = "[\"Dashboard\",\"Support\",\"FAQs\"]",
		DisplayOrder = 603,
		PTID = PrivilegeSeedData.AS001.PTID
	};

	public static mtMenu ContactCenter = new()
	{
		Id = new Guid("f2291ac0-0469-488a-9f9c-d5596dd1ed7f"),
		Label = "Contact Center",
		To = "/support/contact-center",
		ParentId = SupportGroup.Id,
		Visible = true,
		Breadcrumb = "[\"Dashboard\",\"Support\",\"ContactCenter\"]",
		DisplayOrder = 604,
		PTID = PrivilegeSeedData.AS003.PTID
	};

	public static mtMenu AppVersion = new()
	{
		Id = new Guid("8911cdf9-71ec-49aa-ad3b-716c966a54df"),
		Label = "App Version",
		To = "/support/app-version",
		ParentId = SupportGroup.Id,
		Visible = true,
		Breadcrumb = "[\"Dashboard\",\"Support\",\"App Version\"]",
		DisplayOrder = 605,
		PTID = PrivilegeSeedData.AS005.PTID
	};

	public static mtMenu AppMaintenance = new()
	{
		Id = new Guid("16383f7a-aed4-4b92-ac83-2d602aa2d508"),
		Label = "App Maintenance",
		To = "/support/app-maintenance",
		ParentId = SupportGroup.Id,
		Visible = true,
		Breadcrumb = "[\"Dashboard\",\"Support\",\"App Maintenance\"]",
		DisplayOrder = 606,
		PTID = PrivilegeSeedData.AS007.PTID
	};

	public static mtMenu LegalContent = new()
	{
		Id = new Guid("35924bcd-d085-4c3a-8026-37ea2ca82482"),
		Label = "Legal Content",
		To = "/legal/legal-content",
		Breadcrumb = "[\"Legal\",\"Legal Content\"]",
		ParentId = SupportGroup.Id,
		Visible = true,
		PTID = PrivilegeSeedData.AS009.PTID,
		DisplayOrder = 607,
	};

}
