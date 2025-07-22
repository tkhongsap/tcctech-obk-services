namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
public class CaseCreateTaskRequest
{
	public string Name { get; set; } = default!;
	public int CaseId { get; set; } = default!;
	public int StatusCode { get; set; } = default!;
	public int IsCritical { get; set; } = default!;
	public string TaskCategoryId { get; set; } = default!;

	public CaseCreateTaskRequest(string name, int caseid, int statuscode, int iscritical, string taskcategoryid)
	{
		Name = name;
		CaseId = caseid;
		StatusCode = statuscode;
		IsCritical = iscritical;
		TaskCategoryId = taskcategoryid;
	}
}
