using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.LogPose;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.SaveSensing;

public sealed class SaveSensingCommandHandler : ICommandHandler<SaveSensingCommand, SaveSensingResult>
{
	private readonly ILogPoseService _service;
	public SaveSensingCommandHandler(ILogPoseService service)
	{
		_service = service;
	}

	public async Task<SaveSensingResult> Handle(SaveSensingCommand request, CancellationToken cancellationToken)
	{
		return await _service.SaveSensing(request.AppName, request.RefLat, request.RefLong, request.RefFloor, request.RefBuilding, request.RefQR, request.RefGrid,
			request.WifiJson, request.GpsJson, request.BluetoothJson, request.MagneticJson, request.BaroJson, request.CreatedBy);
	}

}

