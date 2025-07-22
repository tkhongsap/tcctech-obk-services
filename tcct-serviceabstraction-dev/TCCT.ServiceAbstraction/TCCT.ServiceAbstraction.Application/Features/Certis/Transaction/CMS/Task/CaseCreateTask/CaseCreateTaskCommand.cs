using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
public class CaseCreateTaskCommand : ICommand<CaseCreateTaskResult>
{
	public string Name { get; set; } = default!;
	public int CaseId { get; set; } = default!;
	public int StatusCode { get; set; } = default!;
	public int IsCritical { get; set; } = default!;
	public string TaskCategoryId { get; set; } = default!;


	public CaseCreateTaskCommand(CaseCreateTaskRequest request)
	{
		Name = request.Name;
		CaseId = request.CaseId;
		StatusCode = request.StatusCode;
		IsCritical = request.IsCritical;
		TaskCategoryId = request.TaskCategoryId;
	}
}
