using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Complete;
public class CompleteCommandHandler : ICommandHandler<CompleteCommand, CompleteResult>
{
	private readonly ICertisService _certisservice;
	public CompleteCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CompleteResult> Handle(CompleteCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.Complete(request.WoId, request.CompletionComment, request.CompletionSignature, request.CompletedBy);
		return res;
	}
}
