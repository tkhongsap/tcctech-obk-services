

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCase;

public class GetCaseResult
{
    public int Id { get; set; }
    public string? ShortDesc { get; set; }
    public string? CaseNo { get; set; }
    public int? EventTypeId { get; set; }
    public string? EventTypeCode { get; set; }
    public int? LocationId { get; set; }
    public string? LocationCode { get; set; }
    public string? LocationName { get; set; }
    public int? PriorityLevelId { get; set; }
    public int? SiteHandler { get; set; }
    public int? StatusCode { get; set; }
    public string? Timestamp { get; set; }
    public DateTime? CreatedOn { get; set; }
    public int? SlaConfigId { get; set; }
    public int? CaseTypeId { get; set; }
    public string? CreatedBy { get; set; }
    public bool? SlaFailed { get; set; }
    public DateTime? SlaDate { get; set; }
    public string? Description { get; set; }
    public string? EquipmentTag { get; set; }
    public string? ExternalRefNo { get; set; }
    public bool? IsCritical { get; set; }
    public string? PriorityText { get; set; }
    public int? SyncStatus { get; set; }
    public int? SyncUtcTs { get; set; }
    public List<GetCaseTaskResult>? TrCaseTasks { get; set; } = new List<GetCaseTaskResult>();
    public List<GetCaseMediaResult>? TrCaseMedias { get; set; } = new List<GetCaseMediaResult>();
}

public record GetCaseTaskResult
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int CaseId { get; set; }
    public int? StatusCode { get; set; }
    public int? Sequence { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedOn { get; set; }
    public string? ModifiedBy { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public bool? IsCritical { get; set; }
    public int? TaskCategoryId { get; set; }
    public int? AssignedStaffId { get; set; }
	public string? AssignedStaffDisplayName { get; set; }
}

public record GetCaseMediaResult
{
    public int Id { get; set; }
    public int CaseId { get; set; }
    public string? FileName { get; set; }
    public string? Data { get; set; }
    public string? MimeType { get; set; }
}

