namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertieDetails;
public class GetPropertieDetailsResult {
   public GetPropertieDetailsResultData property { get; set; } = new GetPropertieDetailsResultData();
   public List<UnansweredQuestionnaires>? unansweredQuestionnaires { get; set; }
}


public class GetPropertieDetailsResultData {
    public string? propertyUnitId { get; set; }
    public string? companyName { get; set; }
    public string? companyId { get; set; }
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
    public string? buildingId { get; set; }
    public string? projectsNameThai { get; set; }
    public string? ownershipRatio { get; set; }
    public string? unitArea { get; set; }
    public string? projectId { get; set; }
    public List<Floors>? floors { get; set; }
    public string? homeId { get; set; } = string.Empty;
    public List<Directions>? directions { get; set; }
    public PropertyUnitTypeDetails? propertyUnitTypeDetails { get; set; }
    public string? warrantyStartDate { get; set; }
    public string? warrantyEndDate { get; set; }
    public string? insuranceStartDate { get; set; }
    public string? insuranceEndDate { get; set; }
    public ProjectGeoLocation? projectGeoLocation { get; set; }
    public BimData bimData{ get; set; }
}

public class GetPropertieDetailsResultServiceMind {
    public string? tenantId { get; set; }
    public GetPropertieDetailsResultProperty property { get; set; } = new GetPropertieDetailsResultProperty();
    public List<UnansweredQuestionnaires>? unansweredQuestionnaires { get; set; }
}

public class GetPropertieDetailsResultProperty {
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
    public string? companyId { get; set; }
    public string? buildingId { get; set; }
    public string? projectsNameThai { get; set; }
    public string? ownershipRatio { get; set; }
    public string? UnitArea { get; set; }
    public string? projectId { get; set; }
    public bool? hideLogoFromFrontEnd { get; set; }
    public bool isPropertyOwner { get; set; }
    public bool isPropertyResident { get; set; }
    public bool isDefaultPropertyUnit { get; set; }
    public string? backgroundUrl { get; set; }
    public string? iconUrl { get; set; }
    public string? ownershipContractNumber { get; set; }
    public string? ownershipContractStartDate { get; set; }
    public string? ownershipContractEndDate { get; set; }
    public string? warrantyStartDate { get; set; }
    public string? warrantyEndDate { get; set; }
    public string? insuranceStartDate { get; set; }
    public string? insuranceEndDate { get; set; }
    public string? moveInDate { get; set; }
    public string? moveOutDate { get; set; }
    public List<Floors>? floors { get; set; }
    public ThirdPartyIntegration thirdPartyIntegration { get; set; } = new ThirdPartyIntegration();
    public List<Directions>? directions { get; set; }
    public PropertyUnitTypeDetails? propertyUnitTypeDetails { get; set; }
    public ProjectGeoLocation? projectGeoLocation { get; set; }
    public BimData bimData{ get; set; }
}

public class BimData {
    public bool? active { get; set; }
    public string? remark { get; set; }
    public string? houseId { get; set; }
    public int? createBy { get; set; }
    public int? updateBy { get; set; }
    public string? createTime { get; set; }
    public string? unitNumber { get; set; }
    public string? updateTime { get; set; }
    public int? ResidenceID { get; set; }
    public List<ResidenceAuthFloor>? ResidenceAuthFloor { get; set; }
}
public class ResidenceAuthFloor {
    public int? floorID { get; set; }
    public string? floorName { get; set;}
    public List<Location>? locations { get; set; }
}

public class Location {
    public bool? active { get; set; }
    public int? zoneID { get; set; }
    public int? floorID { get; set; }
    public int? towerID { get; set; }
    public int? beaconID { get; set; }
    public string? zoneName { get; set; }
    public string? floorName { get; set; }
    public int? projectID { get; set; }
    public string? towerName { get; set; }
    public string? beaconName { get; set; }
    public string? createTime { get; set; }
    public int? locationID { get; set; }
    public string? updateTime { get; set; }
    public string? projectName { get; set; }
    public string? elevatorName { get; set; }
    public string? locationName { get; set; }
    public string? zoneNameThai { get; set; }
    public string? beaconMajorCode { get; set; }
    public string? beaconMinorCode { get; set; }
    public string? locationNameThai { get; set; }
}

public class ProjectGeoLocation {
    public double? latitude { get; set; }
    public double? longitude { get; set; }
    public double? radius { get; set; }
}

public class ThirdPartyIntegration {
    public string? homeId { get; set; }
}

public class Floors {
    public string? floorZoneCode { get; set; }
    public int? floorId { get; set; }
    public string? floorDescription { get; set; }
}

public class Directions {
    public int? directionId { get; set; }
    public string? directionCode { get; set; }
    public string? description { get; set; }
}

public class PropertyUnitTypeDetails {
    public int? propertyTypeId { get; set; }
    public string? propertyTypeCode { get; set; }
    public string? description { get; set; }
}
public class UnansweredQuestionnaires {
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? fromDate { get; set; }
    public string? toDate { get; set; }
    public string? duration { get; set; }
    public string? durationUnit { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedAt { get; set; }
    public string? updatedBy { get; set; }
    public bool? isActive { get; set; }
    public int? status { get; set; }
    public int? activeUntil { get; set; }
    public string? projectId { get; set; }
    public string? title { get; set; }
    public string? description { get; set; }
    public BannerImage? bannerImage { get; set; }
    public bool? alreadySubmitted { get; set; }
    public string? submittedAt { get; set; }
    public List<GetQuestionnaireDetailResultDataSections>? sections { get; set; }
}

public class GetQuestionnaireDetailResultDataSections
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? seqNo { get; set; }
    public int? questionnaireId { get; set; }
    public long? createdBy { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }  
    public long? updatedBy { get; set; }
    public bool? isDeleted { get; set; }
    public string? title { get; set; }
    public GetQuestionnaireDetailResultDataQuestionInlineImage? inlineImage { get; set; }
    public List<GetQuestionnaireDetailResultDataQuestion>? questions { get; set; }
}
public class BannerImage
{
    public int? id { get; set; }
    public int? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public int? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? refImageUrl { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestion
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? seqNo { get; set; }
    public int? questionnaireId { get; set; }
    public int? type { get; set; }
    public bool? allowImageUpload { get; set; } 
    public bool? allowFileUpload { get; set; }
    public bool? required { get; set; }
    public int? createdBy { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
    public bool? isDeleted { get; set; }
    public int? sectionId { get; set; }
    public string? question { get; set; }
    public int? minLength { get; set; }
    public int? maxLength { get; set; }
    public string? questionTypeName { get; set; } 
    public List<GetQuestionnaireDetailResultDataQuestionOption>? options { get; set; }
    // public List<GetQuestionnaireDetailResultDataQuestionAnswer>? answers { get; set; }
    public List<GetQuestionnaireDetailResultDataQuestionImage>? images { get; set; }
    public List<GetQuestionnaireDetailResultDataQuestionFile>? files { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionOption
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? seqNo { get; set; }
    public int? questionId { get; set; }
    public int? questionnaireId { get; set; }
    public string? text { get; set; }
    public bool? otherOption { get; set; }
    public int? createdBy { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionInlineImage
{
    public int? id { get; set; }
    public int? entityId { get; set; }
    public string? entityType { get; set; }
    public string? s3Url { get; set; }
    public string? title { get; set; }
    public string? name { get; set; }
    public long? createdAt { get; set; }
    public long? updatedAt { get; set; }
    public bool? isActive { get; set; }
    public int? orgId { get; set; }
    public string? s3Path { get; set; }
    public string? record_id { get; set; }
    public string? source_rid { get; set; }
    public string? refImageUrl { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionAnswer
{
    public int? questionId { get; set; }
    public string? answer { get; set; }
    public int? selectedOptionId { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionImage
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? tenantId { get; set; }
    public int? questionId { get; set; }
    public int? questionnaireId { get; set; }
    public string? url { get; set; }
    public long? createdAt { get; set; }
    public int? createdBy { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
}

public class GetQuestionnaireDetailResultDataQuestionFile
{
    public int? id { get; set; }
    public int? orgId { get; set; }
    public int? tenantId { get; set; }
    public int? questionId { get; set; }
    public int? questionnaireId { get; set; }
    public string? url { get; set; }
    public long? createdAt { get; set; }
    public int? createdBy { get; set; }
    public long? updatedAt { get; set; }
    public int? updatedBy { get; set; }
}