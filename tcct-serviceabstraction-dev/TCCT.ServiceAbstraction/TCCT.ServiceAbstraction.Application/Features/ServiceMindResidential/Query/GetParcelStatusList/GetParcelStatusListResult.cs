namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcelStatusList;
public class GetParcelStatusListResult
{
    public List<GetParcelStatusListResultProperty>? data { get; set; }
}

public class GetParcelStatusListResultProperty
{
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? projectId { get; set; }
    public string? statusName { get; set; }
    public int? statusId { get; set; }
    public int? listOrder { get; set; }
    public bool isDefault { get; set; }
    public string? totalParcelCount { get; set; }
    public string? unreadParcelCount { get; set; }
    public string? readParcelCount { get; set; }
}