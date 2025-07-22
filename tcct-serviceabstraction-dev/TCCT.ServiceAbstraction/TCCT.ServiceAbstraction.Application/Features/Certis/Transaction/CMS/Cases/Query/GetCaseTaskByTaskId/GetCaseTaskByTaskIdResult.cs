namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseTaskByTaskId;
public class GetCaseTaskByTaskIdResult
{
	public int Id { get; set; }
	public string Name { get; set; }
	public int CaseId { get; set; }
	public int StatusCode { get; set; }
	public int Sequence { get; set; }
	public string CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
	public bool IsCritical { get; set; }
	public int TaskCategoryId { get; set; }
}
