using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Complete;
public class CompleteCommandHandler : ICommandHandler<CompleteCommand, CompleteResult>
{
	private readonly ICertisService _certisservice;
	public CompleteCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CompleteResult> Handle(CompleteCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.Complete(request.CwoId, request.CompletionComment, request.CompletionAckedBy, request.CompletionSignature, request.CompletedBy, request.LocationId, request.Description, request.RequesterId, request.AssetId);
		return res;
	}
}
