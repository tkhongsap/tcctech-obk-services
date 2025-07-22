

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;
public class CreateCaseTasksModel
{
	public int Id { get; set; }
	public string Name { get; set; }
	public int CaseId { get; set; }
	public int StatusCode { get; set; }
	public int Sequence { get; set; }
	public string? CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }
	public string? ModifiedBy { get; set; }
	public DateTime ModifiedOn { get; set; }
	public bool IsCritical { get; set; }
	public int TaskCategoryId { get; set; }
	public CreateCaseTasksModel(int id, string name, int caseId, int statusCode, int sequence, int taskCategoryId, string createdBy, DateTime createdOn, string modifiedBy, DateTime modifiedOn, bool isCritical)
	{
		Id = id;
		Name = name;
		CaseId = caseId;
		StatusCode = statusCode;
		Sequence = sequence;
		TaskCategoryId = taskCategoryId;
		CreatedBy = createdBy;
		CreatedOn = createdOn;
		ModifiedBy = modifiedBy;
		ModifiedOn = modifiedOn;
		IsCritical = isCritical;
	}
}