using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;

public static class OpsappMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("8b3c633c-eb6b-4165-b073-f15142089e07"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 1200
	};

	public static mtMenu OperaionAppGroup = new()
	{
		Id = new Guid("647d4cff-f4de-4a11-bf38-f2db9836d824"),
		IconName = "SvgOfficeBlock",
		ParentId = Group.Id,
		Label = "Operation app",
		Header = "Operation app",
		DisplayOrder = 1201,
		PTID = PrivilegeSeedData.OP000.PTID
	};

	public static mtMenu OperationsOnboarding = new()
	{
		Id = new Guid("01706d92-128e-40d5-98a3-e54f1e66b810"),
		Label = "Operations Onboarding",
		Header = "Operations Onboarding",
		Breadcrumb = "[\"Operations Onboarding\"]",
		To = "/opsapp-register",
		ParentId = OperaionAppGroup.Id,
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 1202,
		PTID = PrivilegeSeedData.OP001.PTID
	};

	public static mtMenu OperationsOnboardingCreate = new()
	{
		Id = new Guid("67b4b518-80f7-449c-9f17-51e989f5ab90"),
		Label = "Operations Onboarding",
		Header = "Operations Onboarding",
		DisplayOrder = 1203,
		To = "/opsapp-register/create",
		Breadcrumb = "[\"Operations Onboarding\"]",
		ParentId = OperationsOnboarding.Id,
		PTID = PrivilegeSeedData.OP002.PTID,
		Visible = false,
	};
}
