using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Model.CreateCaseIncident;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.CreateCaseIncident;
public class CreateCaseIncidentHandler : ICommandHandler<CreateCaseIncidentCommand, CreateCaseIncidentResult>
{
	private readonly IAbstractionService _apiService;
	public CreateCaseIncidentHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}
	public async Task<CreateCaseIncidentResult> Handle(CreateCaseIncidentCommand request, CancellationToken cancellationToken)
	{
		var result = await _apiService.CertisTransaction.CreateCaseIncident(request);
		return result;
	}
}
