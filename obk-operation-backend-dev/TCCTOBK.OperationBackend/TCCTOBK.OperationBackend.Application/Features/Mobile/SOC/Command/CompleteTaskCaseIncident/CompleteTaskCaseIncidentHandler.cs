using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Model.CompleteTaskCaseIncident;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.CompleteTaskCaseIncident;
public class CompleteTaskCaseIncidentHandler : ICommandHandler<CompleteTaskCaseIncidentCommand, CompleteTaskCaseIncidentResult>
{
	private readonly IAbstractionService _apiService;
	public CompleteTaskCaseIncidentHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}
	public async Task<CompleteTaskCaseIncidentResult> Handle(CompleteTaskCaseIncidentCommand request, CancellationToken cancellationToken)
	{
		var req = new UpdateTaskSOCRequest()
		{
		};
		//await _apiService.CertisTransaction.CreateSoc(req);
		return new CompleteTaskCaseIncidentResult();
	}
}
