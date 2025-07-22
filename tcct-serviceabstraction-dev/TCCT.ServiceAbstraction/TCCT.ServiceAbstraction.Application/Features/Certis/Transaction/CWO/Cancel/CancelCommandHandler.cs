using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Cancel;
public class CancelCommandHandler : ICommandHandler<CancelCommand, CancelResult>
{
	public Task<CancelResult> Handle(CancelCommand request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
