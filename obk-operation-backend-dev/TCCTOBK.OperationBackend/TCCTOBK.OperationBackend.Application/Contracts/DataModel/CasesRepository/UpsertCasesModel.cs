

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;
public class UpsertCasesModel
{
	public int Id { get; set; }
	public string? ShortDesc { get; set; }
	public required string CaseNo { get; set; }
	public int EventTypeId { get; set; }
	public string? EventTypeCode { get; set; }
	public int LocationId { get; set; } = 0;
	public string? LocationCode { get; set; } = string.Empty;
	public string? LocationName { get; set; }
	public int PriorityLevelId { get; set; }
	public int? SlaConfigId { get; set; }
	public int? CaseTypeId { get; set; }
	public string? CreatedBy { get; set; }
	public bool? SlaFailed { get; set; }
	public DateTime SlaDate { get; set; }
	public string? Description { get; set; }
	public string? EquipmentTag { get; set; }
	public string? ExternalRefNo { get; set; }
	public bool? IsCritical { get; set; }
	public int? SiteHandler { get; set; }
	public int? StatusCode { get; set; }
	public string Timestamp { get; set; }
	public DateTime CreatedOn { get; set; }
	public string? ModifiedBy { get; set; }
	public DateTime? ModifiedOn { get; set; }
	public string? Requester { get; set; }

	// public UpsertCasesModel(int id, string? shortDesc, string caseNo, int eventTypeId, string? eventTypeCode, int locationId, string? locationCode, string? locationName, int priorityLevelId, int? slaConfigId, int? caseTypeId, string? createdBy, bool? slaFailed, DateTime? slaDate, string? description, string? equipmentTag, string? externalRefNo, bool isCritical, int? siteHandler, int? statusCode, string timestamp, DateTime? createdOn)
	// {
	// 	Id = id;
	// 	ShortDesc = shortDesc;
	// 	CaseNo = caseNo;
	// 	EventTypeId = eventTypeId;
	// 	EventTypeCode = eventTypeCode;
	// 	LocationId = locationId;
	// 	LocationCode = locationCode;
	// 	LocationName = locationName;
	// 	PriorityLevelId = priorityLevelId;
	// 	SlaConfigId = slaConfigId;
	// 	CaseTypeId = caseTypeId;
	// 	CreatedBy = createdBy;
	// 	SlaFailed = slaFailed;
	// 	SlaDate = slaDate;
	// 	Description = description;
	// 	EquipmentTag = equipmentTag;
	// 	ExternalRefNo = externalRefNo;
	// 	IsCritical = isCritical;
	// 	SiteHandler = siteHandler;
	// 	StatusCode = statusCode;
	// 	Timestamp = timestamp;
	// 	CreatedOn = createdOn;
	// }
}