namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetProfile;

public class GetProfileResult {
    public string? tenantId { get; set; }
    public string? name { get; set; }
    public string? email { get; set; }
    public string? userName { get; set; }
    public string? mobileNo { get; set; }
    public string? address { get; set; }
    public string? gender { get; set; }
    public string? countryCode { get; set; }
    public bool isResident { get; set; }
    public bool isPropertyOwner { get; set; }
    public string? userType { get; set; }
    public string? nationalIdTaxId { get; set; }
    public string? fax { get; set; }
    public string? phoneNo { get; set; }
    public string? defaultUnit { get; set; }
    public bool isActive { get; set; }
    public List<ImageProfile> images { get; set; } = new List<ImageProfile>();
    public List<ProfileProperty> properties { get; set; } = new List<ProfileProperty>();
}

public class ProfileProperty {
    public string? companyName { get; set; }
    public string? projectName { get; set; }
    public string? buildingPhase { get; set; }
    public string? floorZone { get; set; }
    public string? unitNumber { get; set; }
    public string? houseNumber { get; set; }
    public string? customer { get; set; }
    public bool isAllocated { get; set; }
    public bool setMapping { get; set; }
    public bool isDefault { get; set; }
    public bool isPropertyOwner { get; set; }   
    public bool isPropertyResident { get; set; }
    public bool isDefaultPropertyUnit { get; set; }
    public bool? hideLogoFromFrontEnd { get; set; }
    public string? backgroundUrl { get; set; }
    public string? iconUrl { get; set; }
    public string? homeId { get; set; } = string.Empty;
}

public class GetProfileResultServiceMind {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? email { get; set; }
    public string? countryCode { get; set; }
    public string? phoneNumber { get; set; }
    public bool isResident { get; set; }
    public bool isPropertyOwner { get; set; }
    public ResidentProfile residentProfile { get; set; } = new ResidentProfile();
    public PropertyOwnerProfile propertyOwnerProfile { get; set; } = new PropertyOwnerProfile();
    public List<Property> properties { get; set; } = new List<Property>();
    public Property defaultUnit { get; set; } = new Property();
}

public class ResidentProfile {
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public string? gender { get; set; }
    public string? idcard { get; set; }
    public string? passport { get; set; }
    public string? note { get; set; }
    public string? cardNumber { get; set; }
    public bool isActive { get; set; }
    public List<ImageProfile> images { get; set; } = new List<ImageProfile>();
    public List<Email> emails { get; set; } = new List<Email>();
    public List<Phone> phones { get; set; } = new List<Phone>();
}

public class ImageProfile {
    public string? s3Url { get; set; }
}

public class PropertyOwnerProfile {
    public string? firstName { get; set; }
    public string? lastName { get; set; }
    public bool isActive { get; set; }
}

public class Email {
    public string? email { get; set; }
    public bool isActive { get; set; }
}

public class Phone {
    public string? countryCode { get; set; }
    public string? phoneNumber { get; set; }
    public bool isActive { get; set; }
}

public class Property {
    public string? propertyUnitId { get; set; }
    public string? unitNumber { get; set; }
    public string? houseNumber { get; set; }
    public string? floorZoneCode { get; set; }
    public string? floorDescription { get; set; }
    public string? buildingPhaseCode { get; set; }
    public string? buildingPhaseName { get; set; }
    public string? projectCode { get; set; }
    public string? projectsName { get; set; }
    public string? companyName { get; set; }
    public bool? hideLogoFromFrontEnd { get; set; }
    public bool isPropertyOwner { get; set; }
    public bool isPropertyResident { get; set; }
    public bool isDefaultPropertyUnit { get; set; }
    public string? backgroundUrl { get; set; }
    public string? iconUrl { get; set; }
    public ThirdPartyIntegration thirdPartyIntegration { get; set; } = new ThirdPartyIntegration();
}

public class ThirdPartyIntegration {
    public string? homeId { get; set; }
}