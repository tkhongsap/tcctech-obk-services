using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SetState;
public class SetStateHandler : ICommandHandler<SetStateCommand, SetStateResult>
{
	private readonly INetatmoService _netatmoservice;
	public SetStateHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public Task<SetStateResult> Handle(SetStateCommand request, CancellationToken cancellationToken)
	{
		switch (request.operation)
		{
			case "set manual temp"://"set manual temp"  :Room{ID,therm_setpoint_mode,therm_setpoint_temperature}
				return _netatmoservice.SetState(request.id, request.rooms!, request.operation, request.tenant_id);
			case "set max temp"://"set max temp // frostguard//home mode":
				return _netatmoservice.SetState(request.id, request.rooms!, request.operation, request.tenant_id);
			case "set frostguard"://"set frostguard":
				return _netatmoservice.SetState(request.id, request.rooms!, request.operation, request.tenant_id);
			case "set home mode"://"set home mode":
				return _netatmoservice.SetState(request.id, request.rooms!, request.operation, request.tenant_id);
			case "set light":
				return _netatmoservice.SetState(request.id, request.modules!, request.operation, request.tenant_id);
			case "set launch state":
				return _netatmoservice.SetState(request.id, request.modules!, request.operation, request.tenant_id);
			case "set staircase light":
				return _netatmoservice.SetState(request.id, request.modules!, request.operation, request.tenant_id);
			case "set roller shutter":
				return _netatmoservice.SetState(request.id, request.modules!, request.operation, request.tenant_id);
			case "set brightness":
				return _netatmoservice.SetState(request.id, request.modules!, request.operation, request.tenant_id);
			case "set air fan":
				return _netatmoservice.SetState(request.id, request.modules!, request.operation, request.tenant_id);
			default:
				throw NetatmoException.NTM005("Invalid operation");
		}
	}
}
