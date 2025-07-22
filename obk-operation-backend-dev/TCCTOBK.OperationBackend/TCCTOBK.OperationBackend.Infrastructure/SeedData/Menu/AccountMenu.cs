using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class AccountMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("468c162a-ea3f-4aa8-84c0-69c04ce0c883"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 800
	};

	public static mtMenu MyAccountGroup = new()
	{
		Id = new Guid("ed8b89d9-aa36-4fa2-bc23-5e5cdf8fd85e"),
		Label = "My account",
		ParentId = Group.Id,
		Header = "My account",
		IconName = "SvgUser",
		Visible = true,
		DisplayOrder = 801
	};

	public static mtMenu PersonalInfo = new()
	{
		Id = new Guid("d3a532d7-c625-4d48-8699-e8b6f915da71"),
		Label = "Personal Information",
		Header = "Personal information",
		To = "/account/personal-information",
		ParentId = MyAccountGroup.Id,
		Visible = true,
		DisplayOrder = 802
	};

}
