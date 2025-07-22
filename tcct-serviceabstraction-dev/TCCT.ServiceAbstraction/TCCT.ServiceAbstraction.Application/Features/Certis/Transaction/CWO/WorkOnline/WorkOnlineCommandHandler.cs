using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOnline;
public class WorkOnlineCommandHandler : ICommandHandler<WorkOnlineCommand, WorkOnlineResult>
{
	public Task<WorkOnlineResult> Handle(WorkOnlineCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
