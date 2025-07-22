namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Command;
public class CasesResult
{
	public int Id { get; set; }
	public string ShortDesc { get; set; } = string.Empty;
	public string CaseNo { get; set; } = string.Empty;
	public int EventTypeId { get; set; }
	public string EventTypeCode { get; set; } = string.Empty;
	public int LocationId { get; set; }
	public string LocationCode { get; set; } = string.Empty;
	public string LocationName { get; set; } = string.Empty;
	public int PriorityLevelId { get; set; }
	public int SLAConfigId { get; set; }
	public int CaseTypeId { get; set; }
	public int SiteHandler { get; set; }
	public int StatusCode { get; set; }
	public DateTime Timestamp { get; set; }
	public DateTime CreatedOn { get; set; }
	public string CreatedBy { get; set; } = string.Empty;
	public DateTime SLADate { get; set; }
	public List<Task> Tasks { get; set; } = null!;
}

public class Task
{
	public int Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public int CaseId { get; set; }
	public int StatusCode { get; set; }
	public int Sequence { get; set; }
	public string CreatedBy { get; set; } = string.Empty;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = string.Empty;
	public DateTime ModifiedOn { get; set; }
	public bool IsCritical { get; set; }
	public int TaskCategoryId { get; set; }
}
