using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Model.UpdateTaskCaseIncident;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.UpdateTaskCaseIncident;
public class UpdateTaskCaseIncidentHandler : ICommandHandler<UpdateTaskCaseIncidentCommand, UpdateTaskCaseIncidentResult>
{
	private readonly IAbstractionService _apiService;
	public UpdateTaskCaseIncidentHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}
	public async Task<UpdateTaskCaseIncidentResult> Handle(UpdateTaskCaseIncidentCommand request, CancellationToken cancellationToken)
	{
		var req = new UpdateTaskSOCRequest()
		{
			CaseId = request.CaseId,
			Id = request.Id,
			Name = request.Name,
			StatusCode = request.StatusCode,
			IsCritical = request.IsCritical,
			TaskCategoryId = request.TaskCategoryId,
			AssignedStaffId = request.AssignedStaffId,
			AssignedStaffDisplayName = request.AssignedStaffDisplayName,
			CreatedBy = request.CreatedBy,
			CreatedOn = request.CreatedOn,
			Sequence = request.Sequence
		};
		await _apiService.CertisTransaction.UpdateTaskSOC(req);
		var res = new UpdateTaskCaseIncidentResult();
		return res;
	}
}
