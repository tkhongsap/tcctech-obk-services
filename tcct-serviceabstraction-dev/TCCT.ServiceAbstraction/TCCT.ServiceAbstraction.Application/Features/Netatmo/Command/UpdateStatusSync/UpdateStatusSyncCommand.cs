using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpdateStatusSync;
public class UpdateStatusSyncCommand : ICommand<UpdateStatusSyncResult>
{
	public int StatusId { get; set; }
}