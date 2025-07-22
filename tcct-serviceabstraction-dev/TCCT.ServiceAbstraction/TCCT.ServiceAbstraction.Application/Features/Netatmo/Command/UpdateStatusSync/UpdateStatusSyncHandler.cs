using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpdateStatusSync;
public class UpdateStatusSyncHandler : ICommandHandler<UpdateStatusSyncCommand, UpdateStatusSyncResult>
{
	private readonly INetatmoService _netatmoservice;
	public UpdateStatusSyncHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<UpdateStatusSyncResult> Handle(UpdateStatusSyncCommand request, CancellationToken cancellationToken)
	{
		var countSuccess = await _netatmoservice.UpdateSyncStatus(request.StatusId);
		return new UpdateStatusSyncResult
		{
			Success = countSuccess
		};
	}
}