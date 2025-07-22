using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;

public static class UsageMonitoring
{
    public static mtMenu Group = new()
    {
        Id = new Guid("cebff353-c600-4ed9-ac4d-e6d6765fc6f0"),
        Label = "",
        Type = MenuType.GROUP,
        DisplayOrder = 1205
    };

    public static mtMenu UsageMonitoringGroup = new()
    {
        Id = new Guid("70cf0c58-b435-4b3e-91e5-d1b2ccb217ba"),
        IconName = "SvgOfficeBlock",
        ParentId = Group.Id,
        Label = "UsageMonitoring",
        Header = "UsageMonitoring",
        DisplayOrder = 1206,
        PTID = PrivilegeSeedData.UM000.PTID
    };
    public static mtMenu UsageMonitoringSummery = new()
    {
        Id = new Guid("01706d92-128e-40d5-98a3-e54f1e66b813"),
        Label = "UsageMonitoring Summary",
        Header = "UsageMonitoring Summary",
        Breadcrumb = "[\"UsageMonitoring\",\"UsageMonitoring Summary\"]",
        To = "/usagemonitoring",
        ParentId = UsageMonitoringGroup.Id,
        Visible = true,
        Type = MenuType.LIST,
        DisplayOrder = 1207,
        PTID = PrivilegeSeedData.UM001.PTID
    };

    public static mtMenu StaffTable = new()
    {
        Id = new Guid("01706d92-128e-40d5-98a3-e54f1e66b814"),
        Label = "Staff",
        Header = "Staff",
        Breadcrumb = "[\"UsageMonitoring\",\"Staff\"]",
        To = "/usagemonitoring/staff",
        ParentId = UsageMonitoringGroup.Id,
        Visible = true,
        Type = MenuType.LIST,
        DisplayOrder = 1208,
        PTID = PrivilegeSeedData.UM002.PTID
    };
    public static mtMenu Roster = new()
    {
        Id = new Guid("01706d92-128e-40d5-98a3-e54f1e66b815"),
        Label = "Roster",
        Header = "Roster",
        Breadcrumb = "[\"Usage Monitoring\",\"Roster\"]",
        To = "/usagemonitoring/roster",
        ParentId = UsageMonitoringGroup.Id,
        Visible = true,
        Type = MenuType.LIST,
        DisplayOrder = 1209,
        PTID = PrivilegeSeedData.UM003.PTID
    };
    public static mtMenu RosterComponant = new()
    {
        Id = new Guid("01706d92-128e-40d5-98a3-e54f1e66b816"),
        Label = "staff-by-compopnant",
        Header = "Staff By Componant",
        Breadcrumb = "[\"Usage Monitoring\",\"UsageMonitoring Summary\",\"Staff By Componant\"]",
        To = "/usagemonitoring/staff-by-componant",
        ParentId = UsageMonitoringSummery.Id,
        Visible = false,
        DisplayOrder = 1210,
        PTID = PrivilegeSeedData.UM003.PTID
    };
    public static mtMenu Componant = new()
    {
        Id = new Guid("01706d92-128e-40d5-98a3-e54f1e66b817"),
        Label = "all-staff",
        Header = "All Staff",
        Breadcrumb = "[\"Usage Monitoring\",\"Usage Monitoring Summary\",\"All Staff\"]",
        To = "/usagemonitoring/component",
        ParentId = UsageMonitoringSummery.Id,
        Visible = false,
        DisplayOrder = 1211,
        PTID = PrivilegeSeedData.UM003.PTID
    };

}
