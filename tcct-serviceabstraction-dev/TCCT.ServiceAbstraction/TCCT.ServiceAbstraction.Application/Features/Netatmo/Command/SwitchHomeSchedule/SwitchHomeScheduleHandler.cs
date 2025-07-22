using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SwitchHomeSchedule;
public class SwitchHomeScheduleHandler : ICommandHandler<SwitchHomeScheduleCommand, SwitchHomeScheduleResult>
{
	private readonly INetatmoService _netatmoService;
	public SwitchHomeScheduleHandler(INetatmoService netatmoService)
	{
		_netatmoService = netatmoService;
	}
	public async Task<SwitchHomeScheduleResult> Handle(SwitchHomeScheduleCommand request, CancellationToken cancellationToken)
	{
		var res = await _netatmoService.PostSwitchHomeSchedule(request.Operation, request.HomeId, request.ScheduleId, request.ScheduleType, request.Selected, request.TenantId);
		return res;
	}
}