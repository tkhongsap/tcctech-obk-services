using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Close;
public class CloseCommandHandler : ICommandHandler<CloseCommand, CloseResult>
{
	private readonly ICertisService _certisservice;
	public CloseCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CloseResult> Handle(CloseCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.Close(request.CwoId, request.ClosureComment, request.CompletionVerifiedBy, request.ClosureSignature, request.ClosedBy);
		return res;
	}
}
