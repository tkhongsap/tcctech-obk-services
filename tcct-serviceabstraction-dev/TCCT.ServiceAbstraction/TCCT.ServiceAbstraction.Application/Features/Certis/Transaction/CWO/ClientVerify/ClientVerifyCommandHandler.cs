using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ClientVerify;
public class ClientVerifyCommandHandler : ICommandHandler<ClientVerifyCommand, ClientVerifyResult>
{
	private readonly ICertisService _certisservice;
	public ClientVerifyCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<ClientVerifyResult> Handle(ClientVerifyCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.ClientVerify(request.CwoId, request.ClientVerificationComment, request.ClientVerifiedBy, request.ClientVerificationSignature, request.ClientVerificationSubmittedBy);
		return res;
	}
}
