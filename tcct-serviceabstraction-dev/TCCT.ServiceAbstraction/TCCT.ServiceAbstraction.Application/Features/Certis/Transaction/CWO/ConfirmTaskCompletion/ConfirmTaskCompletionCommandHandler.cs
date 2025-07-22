using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion;
public class ConfirmTaskCompletionCommandHandler : ICommandHandler<ConfirmTaskCompletionCommand, ConfirmTaskCompletionResult>
{
	private readonly ICertisService _certisservice;
	public ConfirmTaskCompletionCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<ConfirmTaskCompletionResult> Handle(ConfirmTaskCompletionCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.ConfirmTaskCompletion(request.CwoId, Guid.Parse(request.ConfirmedBy));
		return res;
	}
}
