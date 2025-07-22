using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.File.Command.InUse;

public class InUseCommandHandler : ICommandHandler<InUseCommand, InUseResult>
{
	public Task<InUseResult> Handle(InUseCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
