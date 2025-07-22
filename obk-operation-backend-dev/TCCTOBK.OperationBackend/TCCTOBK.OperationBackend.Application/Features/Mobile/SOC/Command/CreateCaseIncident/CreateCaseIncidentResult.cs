namespace TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.CreateCaseIncident;
public class CreateCaseIncidentResult
{
	public int Id { get; set; }
	public string? ShortDesc { get; set; }
	public string? CaseNo { get; set; }
	public int EventTypeId { get; set; }
	public string? EventTypeCode { get; set; }
	public int LocationId { get; set; }
	public string? LocationCode { get; set; }
	public string? LocationName { get; set; }
	public int PriorityLevelId { get; set; }
	public int SlaConfigId { get; set; }
	public int CaseTypeId { get; set; }
	public int SiteHandler { get; set; }
	public int StatusCode { get; set; }
	public List<CaseIncidentTask> tasks { get; set; } = new();
}

public class CaseIncidentTask
{
	public int Id { get; set; }
	public string? Name { get; set; }
	public int CaseId { get; set; }
	public int StatusCode { get; set; }
	public int Sequence { get; set; }
	public bool IsCritical { get; set; }
	public int TaskCategoryId { get; set; }
}