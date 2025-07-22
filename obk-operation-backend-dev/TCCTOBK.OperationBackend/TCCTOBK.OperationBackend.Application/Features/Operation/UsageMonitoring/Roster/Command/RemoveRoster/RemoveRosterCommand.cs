

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.RemoveRoster;

public class RemoveRosterCommand : ICommand<Guid>
{
	public Guid Id { get; set; }
	public RemoveRosterCommand(Guid id)
	{
		Id = id;
	}
}