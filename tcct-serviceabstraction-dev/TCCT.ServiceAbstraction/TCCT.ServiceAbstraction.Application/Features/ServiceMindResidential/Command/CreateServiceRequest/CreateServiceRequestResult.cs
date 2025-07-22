namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.CreateServiceRequest;

public class CreateServiceRequestResult
{
	public CreateServiceRequestResultData? data { get; set; }
}
public class CreateServiceRequestResultData
{
	public string? orgId { get; set; }
	public string? id { get; set; }
	public string? companyId { get; set; }
	public string? projectId { get; set; }
	public string? displayId { get; set; }
	public string? caseTypeId { get; set; }
	public string? shortDescription { get; set; }
	public string? description { get; set; }
	public string? priorityId { get; set; }
	public string? eventTypeId { get; set; }
	public string? eventSubTypeId { get; set; }
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
	public CreateServiceRequestImage? image { get; set; }
}

public class CreateServiceRequestImage
{
	public string? id { get; set; }
	public string? entityId { get; set; }
	public string? entityType { get; set; }
	public string? s3Url { get; set; }
	public string? title { get; set; }
	public string? name { get; set; }
	public string? createdAt { get; set; }
	public string? updatedAt { get; set; }
	public bool? isActive { get; set; }
	public string? orgId { get; set; }
	public string? s3Path { get; set; }
	public string? recordId { get; set; }
	public string? sourceRid { get; set; }
	public string? refImageUrl { get; set; }
}
        