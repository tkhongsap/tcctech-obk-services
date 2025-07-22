namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDefaultProperty;
public class GetDefaultPropertyResult
{
    public string? tenantId { get; set; }
    public GetDefaultPropertyResultProperty property { get; set; } = new();
}

public class GetDefaultPropertyResultProperty
{
    public string? propertyUnitId { get; set; }
    public string? unitNumber { get; set; }
    public string? floorZoneCode { get; set; }
    public string? floorDescription { get; set; }
    public string? buildingPhaseCode { get; set; }
    public string? buildingPhaseName { get; set; }
    public string? projectCode { get; set; }
    public string? projectsName { get; set; }
    public string? companyName { get; set; }
    public bool isPropertyOwner { get; set; }
    public bool isPropertyResident { get; set; }
    public bool isDefaultPropertyUnit { get; set; }
    public string? backgroundUrl { get; set; }
    public string? iconUrl { get; set; }
}