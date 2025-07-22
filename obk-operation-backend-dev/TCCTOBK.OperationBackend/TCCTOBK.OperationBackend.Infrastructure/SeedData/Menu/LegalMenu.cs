using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class LegalMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("d92e228b-dca7-4d3d-b231-db107caa786a"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 700
	};

	public static mtMenu LegalGroup = new()
	{
		Id = new Guid("36d340cb-23df-40c8-a0a7-a3161fa8007d"),
		Label = "Legal",
		ParentId = Group.Id,
		IconName = "SvgLegal",
		Visible = true,
		DisplayOrder = 701
	};

	public static mtMenu LegalContent = new()
	{
		Id = new Guid("35924bcd-d085-4c3a-8026-37ea2ca82482"),
		Label = "Legal Content",
		To = "/legal/legal-content",
		Breadcrumb = "[\"Legal\",\"Legal Content\"]",
		ParentId = LegalGroup.Id,
		Visible = true,
		DisplayOrder = 702,
	};


	//public static mtMenu AboutUs = new()
	//{
	//	Id = new Guid("38b0d51c-a02c-43ce-9964-33531233c1f6"),
	//	Label = "About Us",
	//	To = "/legal/about-us",
	//	ParentId = new Guid("36d340cb-23df-40c8-a0a7-a3161fa8007d"),
	//	Visible = true,
	//	DisplayOrder = 702
	//};

	//public static mtMenu PrivacyStatement = new()
	//{
	//	Id = new Guid("efc98d86-5aa6-4ae1-91f6-b942d556f09b"),
	//	Label = "Privacy Statement",
	//	To = "/legal/privacy-statement",
	//	ParentId = new Guid("36d340cb-23df-40c8-a0a7-a3161fa8007d"),
	//	Visible = true,
	//	DisplayOrder = 703
	//};

	//public static mtMenu termConditions = new()
	//{
	//	Id = new Guid("2a84aa84-f0a6-4483-b398-594dbacc06c3"),
	//	Label = "Terms and Conditions",
	//	To = "/legal/tnc",
	//	ParentId = new Guid("36d340cb-23df-40c8-a0a7-a3161fa8007d"),
	//	Visible = true,
	//	DisplayOrder = 704
	//};

	//public static mtMenu PDPA = new()
	//{
	//	Id = new Guid("8a467a3d-12fb-4907-abba-8145fd35a4fc"),
	//	Label = "PDPA",
	//	To = "/legal/pdpa",
	//	ParentId = new Guid("36d340cb-23df-40c8-a0a7-a3161fa8007d"),
	//	Visible = true,
	//	DisplayOrder = 705
	//};

}
