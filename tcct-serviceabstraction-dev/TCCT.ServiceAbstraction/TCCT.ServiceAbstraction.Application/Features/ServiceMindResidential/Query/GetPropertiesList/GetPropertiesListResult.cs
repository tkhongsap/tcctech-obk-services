namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertiesList;

public class GetPropertiesListResult {
    public string? tenantId { get; set; } 
    public List<GetPropertiesListResultPropertyUnit> properties { get; set; } = new List<GetPropertiesListResultPropertyUnit>();
}

public class GetPropertiesListResultPropertyUnit {
    public string? propertyUnitId { get; set; }
    public string? companyName { get; set; }
    public string? companyId { get; set; }
    public string? projectName { get; set; }
    public string? houseNumber { get; set; }
    public string? buildingPhase { get; set; }
    public string? floorZone { get; set; }
    public string? unitNumber { get; set; }
    public string? customer { get; set; }
    public bool isPropertyOwner { get; set; }   
    public bool isPropertyResident { get; set; }
    public bool isDefaultPropertyUnit { get; set; }
    public bool? hideLogoFromFrontEnd { get; set; }
    public bool isAllocated { get; set; }
    public bool setMapping { get; set; }
    public bool isDefault { get; set; }
    public string? backgroundUrl { get; set; }
    public string? iconUrl { get; set; }
    public string? homeId { get; set; } = string.Empty;
    public string? buildingId { get; set; }
    public string? buildingPhaseCode { get; set; }
    public string? projectCode { get; set; }
    public string? projectId { get; set; }
    public string? projectsName { get; set; }
    public string? projectsNameThai { get; set; }
    public ProjectGeoLocation? projectGeoLocation { get; set; }
}

public class GetPropertiesListResultServiceMind {
    public string? tenantId { get; set; }
    public List<GetPropertiesListResultServiceMindPropertyUnit> properties { get; set; } = new List<GetPropertiesListResultServiceMindPropertyUnit>();
}

public class GetPropertiesListResultServiceMindPropertyUnit {
    public string? propertyUnitId { get; set; }
    public string? unitNumber { get; set; }
    public string? houseNumber { get; set; }
    public string? floorZoneCode { get; set; }
    public string? floorDescription { get; set; }
    public string? buildingPhaseCode { get; set; }
    public string? buildingPhaseName { get; set; }
    public string? projectCode { get; set; }
    public string? projectsName { get; set; }
    public bool? hideLogoFromFrontEnd { get; set; }
    public string? companyName { get; set; }
    public string? companyId { get; set; }
    public bool isPropertyOwner { get; set; }   
    public bool isPropertyResident { get; set; }
    public bool isDefaultPropertyUnit { get; set; }
    public string? backgroundUrl { get; set; }
    public string? iconUrl { get; set; }
    public string? buildingId { get; set; }
    public string? projectId { get; set; }
    public string? projectsNameThai { get; set; }
    public ProjectGeoLocation? projectGeoLocation { get; set; }
    public ThirdPartyIntegration thirdPartyIntegration { get; set; } = new ThirdPartyIntegration();
}

public class ProjectGeoLocation {
    public double? latitude { get; set; }
    public double? longitude { get; set; }
    public double? radius { get; set; }
}

public class ThirdPartyIntegration {
    public string? homeId { get; set; }
}