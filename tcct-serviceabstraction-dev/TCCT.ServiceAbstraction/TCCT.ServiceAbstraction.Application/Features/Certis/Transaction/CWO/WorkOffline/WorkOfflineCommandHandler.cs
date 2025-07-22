using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOffline;
public class WorkOfflineCommandHandler : ICommandHandler<WorkOfflineCommand, WorkOfflineResult>
{
	public Task<WorkOfflineResult> Handle(WorkOfflineCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
