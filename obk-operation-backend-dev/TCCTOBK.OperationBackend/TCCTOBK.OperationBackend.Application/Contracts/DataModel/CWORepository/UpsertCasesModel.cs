

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.CWORepository;
public class UpsertCWOModel
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
}