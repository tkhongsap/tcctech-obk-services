using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.SeedData.Menu;
internal static class BuildingMenu
{
    public static mtMenu Group = new()
    {
        Id = new Guid("d4b81ede-36b6-4561-b59a-a15d874c28cf"),
        Label = "",
        Type = MenuType.GROUP,
        DisplayOrder = 500
    };

    public static mtMenu BuildingServiceGroup = new()
    {
        Id = new Guid("1c6b105b-cca1-42ec-9fdc-8ca03b1ef978"),
        Label = "Building Service",
        ParentId = Group.Id,
        Header = "Building Service",
        IconName = "SvgUser",
        Visible = true,
        Type = MenuType.GROUP,
        DisplayOrder = 501,
        PTID = PrivilegeSeedData.BS000.PTID
    };

    public static mtMenu ServiceRequestGroup = new()
    {
        Id = new Guid("245b2e4a-6e4b-4e1b-8dd8-9c46d0438cda"),
        Label = "Service Request",
        Header = "Service Request",
        To = "/building/servicerequest",
        ParentId = BuildingServiceGroup.Id,
        Breadcrumb = "[\"Building Service\"]",
        Visible = true,
        Type = MenuType.LIST,
        DisplayOrder = 502,
        PTID = PrivilegeSeedData.BS001.PTID
    };

    public static mtMenu ServiceRequestShow = new()
    {
        Id = new Guid("5c7b655b-0d9d-4676-83a4-a3fc160bd078"),
        Label = "Service Request",
        Header = "Service Request",
        To = "/building/servicerequest/show/:id",
        ParentId = new Guid("245b2e4a-6e4b-4e1b-8dd8-9c46d0438cda"),
        Breadcrumb = "[\"Building Service\",\"Service Request\"]",
        Visible = false,
        Type = MenuType.SHOW,
        DisplayOrder = 503,
        PTID = PrivilegeSeedData.BS001.PTID
    };

    public static mtMenu ServiceRequestList = new()
    {
        Id = new Guid("ed1aae97-4614-4a27-822d-d3d0dec4d26a"),
        Label = "AC Request",
        Header = "After-hour Air Condition Requests",
        To = "/building/acrequest",
        ParentId = BuildingServiceGroup.Id,
        Breadcrumb = "[\"Building Service\",\"After-hour Air Condition Requests\"]",
        Visible = true,
        Type = MenuType.LIST,
        DisplayOrder = 504,
        PTID = PrivilegeSeedData.BS003.PTID
    };

    public static mtMenu ACRequestShow = new()
    {
        Id = new Guid("1dd4cd55-7ac5-46cf-ad6b-461b32254abb"),
        Label = "AC Request",
        Header = "After-hour Air Condition Requests",
        To = "/building/acrequest/show/:id",
        ParentId = ServiceRequestList.Id,
        Breadcrumb = "[\"Building Service\",\"After-hour Air Condition Requests\"]",
        Visible = false,
        Type = MenuType.SHOW,
        DisplayOrder = 505,
        PTID = PrivilegeSeedData.BS003.PTID
    };

    public static mtMenu ACRequestCreate = new()
    {
        Id = new Guid("1e62d86d-129a-45c4-bb42-d3a0d0fddc96"),
        Label = "AC Request",
        Header = "After-hour Air Condition Requests",
        To = "/building/acrequest/create",
        ParentId = ServiceRequestList.Id,
        Breadcrumb = "[\"Building Service\",\"After-hour Air Condition Requests\"]",
        Visible = false,
        Type = MenuType.CREATE,
        DisplayOrder = 506
    };

    public static mtMenu ACRequestEdit = new()
    {
        Id = new Guid("7cc7ea3f-b216-40af-973f-58734ea4b5ea"),
        Label = "AC Request",
        Header = "After-hour Air Condition Requests",
        To = "/building/acrequest/edit/:id",
        ParentId = ServiceRequestList.Id,
        Breadcrumb = "[\"Building Service\",\"After-hour Air Condition Requests\"]",
        Visible = false,
        Type = MenuType.EDIT,
        DisplayOrder = 507
    };

    public static mtMenu IssueTypeList = new()
    {
        Id = new Guid("75eaf43e-b878-4d95-b668-d6b419100f8f"),
        Label = "Issue type",
        Header = "Issue type",
        To = "/building/issuetype",
        ParentId = BuildingServiceGroup.Id,
        Breadcrumb = "[\"Building Service\"]",
        Visible = true,
        Type = MenuType.LIST,
        DisplayOrder = 508,
        PTID = PrivilegeSeedData.BS005.PTID

    };

    public static mtMenu IssueTypeEdit = new()
    {
        Id = new Guid("1b6827e0-3272-4cf1-8b6b-4313e0fa6632"),
        Label = "Issue type",
        Header = "Issue type",
        To = "/building/servicerequest/edit/:id",
        ParentId = IssueTypeList.Id,
        Breadcrumb = "[\"Building Service\",\"Issue type\"]",
        Visible = false,
        Type = MenuType.EDIT,
        DisplayOrder = 509,
    };
    
    public static mtMenu UrgentServiceRequest = new()
	{
		Id = new Guid("1b6827e0-3272-4cf1-8b6b-4313e0fa6532"),
		Label = "Urgent Service Request",
		Header = "Urgent Service Request",
		To = "/building/inspectionrequest",
		ParentId = BuildingServiceGroup.Id,
		Breadcrumb = "[\"Building Service\",\"Urgent Service Request\"]",
		Visible = true,
		Type = MenuType.LIST,
		DisplayOrder = 510,
	};
}
