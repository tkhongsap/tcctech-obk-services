namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
public class CaseUpdateTaskResult
{
	public int Id { get; set; }
	public string Name { get; set; } = null!;
	public int CaseId { get; set; }
	public int StatusCode { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
	public DateTime ModifiedOn { get; set; }
	public bool IsCritical { get; set; }
	public int TaskCategoryId { get; set; }
}
