using System.Text.Json.Serialization;
namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetFeedbackList;
public class GetFeedbackListResult
{
    public int total { get; set; }
    [JsonPropertyName("per_page")]
    public int perPage { get; set; }
    public int offset { get; set; }
    public int to { get; set; }
    [JsonPropertyName("last_page")]
    public int lastPage { get; set; }
    [JsonPropertyName("current_page")]
    public int currentPage { get; set; }
    public int from { get; set; }
    public List<GetFeedbackListResultData>? data { get; set; }
}

public class GetFeedbackListResultData
{
    public string? id { get; set; }
    public string? orgId { get; set; }
    public string? companyId { get; set; }
    public string? projectId { get; set; }
    public string? displayId { get; set; }
    public string? shortDescription { get; set; }
    public string? description { get; set; }
    public string? caseTypeId { get; set; }
    public string? eventTypeId { get; set; }
    public string? eventTypeCode { get; set; }
    public string? eventTypeDescription { get; set; }
    public string? eventSubTypeId { get; set; }
    public string? eventSubTypeCode { get; set; }
    public string? eventSubTypeName { get; set; }
    public string? eventSubTypeDescription { get; set; }
    public string? assetId { get; set; }
    public int? locationType { get; set; }
    public string? propertyUnitId { get; set; }
    public string? commonAreaId { get; set; }
    public string? tenantId { get; set; }
    public string? cmStatusId { get; set; }
    public string? scheduledAt { get; set; }
    public int? sourceOfRequest { get; set; }
    public string? createdBy { get; set; }
    public string? createdAt { get; set; }
    public string? updatedBy { get; set; }
    public string? updatedAt { get; set; }
    public string? reportedByUnitId { get; set; }
    public string? reportedByTenantId { get; set; }
    public string? reportedByUnitNumber { get; set; }
    public string? reportedByHouseNumber { get; set; }
    public string? reportedByBuildingName { get; set; }
    public string? reportedByBuildingNameTh { get; set; }
    public string? reportedByProjectName { get; set; }
    public string? reportedByProjectNameTh { get; set; }
    public List<GetFeedbackListResultData.ReportedByFloors>? reportedByFloors { get; set; }
    public string? caseTypeName { get; set; }
    public string? feedbackTypeId { get; set; }
    public string? feedbackTypeCode { get; set; }
    public string? feedbackTypeName { get; set; }
    public string? statusCode { get; set; }
    public string? statusName { get; set; }
    public string? s3Url { get; set; }

    public class ReportedByFloors
    {
        public string? floorZoneCode { get; set; }
        public int? floorId { get; set; }
        public string? floorDescription { get; set; }
        public string? floorDescriptionTh { get; set; }
    }
}