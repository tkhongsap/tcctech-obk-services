using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
public static class BuildingAccessMenu
{
	public static mtMenu Group = new()
	{
		Id = new Guid("441badea-bd50-4bf1-908a-b5ca06235d75"),
		Label = "",
		Type = MenuType.GROUP,
		DisplayOrder = 400
	};

	public static mtMenu BuildingAccessServiceGroup = new()
	{
		Id = new Guid("ffb61799-f008-4dee-9645-b6ba162224d2"),
		Label = "Building Access",
		ParentId = Group.Id,
		Header = "Building Access",
		IconName = "SvgBuilding",
		Visible = true,
		Type = MenuType.GROUP,
		DisplayOrder = 401,
		PTID = PrivilegeSeedData.BS000.PTID
	};

	public static mtMenu Tenant = new()
	{
		Id = new Guid("a1558dca-7677-4749-a2f4-71d79779b3ab"),
		Label = "Tenant access",
		Header = "Tenant access",
		To = "/buildingaccess/tenant",
		ParentId = BuildingAccessServiceGroup.Id,
		Breadcrumb = "[\"Building Access\",\"Tenant\"]",
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 410,
	};

	public static mtMenu Visitors = new()
	{
		Id = new Guid("599d3c7a-3a17-427a-8641-68db20dc0042"),
		Label = "Visitors access",
		Header = "Visitors access",
		To = "/buildingaccess/visitors",
		ParentId = BuildingAccessServiceGroup.Id,
		Breadcrumb = "[\"Building Access\",\"Visitors\"]",
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 411,
	};
}
