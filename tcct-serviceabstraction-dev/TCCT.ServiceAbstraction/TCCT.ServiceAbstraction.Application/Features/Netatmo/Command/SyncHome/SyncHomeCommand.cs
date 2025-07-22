using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SyncHome;
public class SyncHomeCommand : ICommand<SyncHomeResult>
{
	public int? Limit { get; set; } = 50;
}