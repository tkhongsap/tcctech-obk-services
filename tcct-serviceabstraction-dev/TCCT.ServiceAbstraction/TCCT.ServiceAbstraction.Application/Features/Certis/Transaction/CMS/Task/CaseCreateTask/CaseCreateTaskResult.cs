namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;

public class CaseCreateTaskResult
{
	public int Id { get; set; }
	public string Name { get; set; }
	public int CaseId { get; set; }
	public int StatusCode { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
	public bool IsCritical { get; set; }
	public int TaskCategoryId { get; set; }
}
