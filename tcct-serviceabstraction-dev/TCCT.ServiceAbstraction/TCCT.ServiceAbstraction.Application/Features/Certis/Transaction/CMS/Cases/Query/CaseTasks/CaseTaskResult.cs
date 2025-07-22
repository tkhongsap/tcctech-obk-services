namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseTasks;
public class CaseTaskResult
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
	public int? AssignedStaffId { get; set; }
	public string? AssignedStaffDisplayName { get; set; }
}
