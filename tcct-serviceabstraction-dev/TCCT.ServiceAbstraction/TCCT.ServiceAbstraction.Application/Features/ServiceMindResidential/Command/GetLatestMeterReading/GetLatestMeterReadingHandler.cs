using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetLatestMeterReading;
public class GetLatestMeterReadingHandler : ICommandHandler<GetLatestMeterReadingCommand, GetLatestMeterReadingResult>
{
	private readonly IServiceMindResidential _service;
	public GetLatestMeterReadingHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetLatestMeterReadingResult> Handle(GetLatestMeterReadingCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetLatestMeterReading(request);
	}
}