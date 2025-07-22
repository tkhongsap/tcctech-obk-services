using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitorCarParkingLog;

public sealed class AddVisitorCarParkingLogCommandHandler : ICommandHandler<AddVisitorCarParkingLogCommand, AddVisitorCarParkingLogResult>
{
	private readonly IServiceMindResidential _service;
	public AddVisitorCarParkingLogCommandHandler(IServiceMindResidential service)
	{
		_service = service;
	}


	public async Task<AddVisitorCarParkingLogResult> Handle(AddVisitorCarParkingLogCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.AddVisitorCarParkingLog(request);
		return res;
	}

}

