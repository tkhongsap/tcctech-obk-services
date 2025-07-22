using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp.Command;
public class AttendWorkCommandHandler : ICommandHandler<AttendWorkCommand, AttendWorkResult>
{
	public Task<AttendWorkResult> Handle(AttendWorkCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
