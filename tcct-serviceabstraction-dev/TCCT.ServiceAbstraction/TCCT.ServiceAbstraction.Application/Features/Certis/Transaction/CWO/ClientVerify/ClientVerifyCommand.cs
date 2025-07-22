using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ClientVerify;
public class ClientVerifyCommand : ICommand<ClientVerifyResult>
{
	public int CwoId { get; set; }
	public string ClientVerificationComment { get; set; } = string.Empty;
	public string ClientVerifiedBy { get; set; } = string.Empty;
	public string ClientVerificationSignature { get; set; } = string.Empty;
	public Guid ClientVerificationSubmittedBy { get; set; }

	public ClientVerifyCommand(ClientVerifyRequest request)
	{
		CwoId = request.CwoId;
		ClientVerificationComment = request.ClientVerificationComment;
		ClientVerifiedBy = request.ClientVerifiedBy;
		ClientVerificationSignature = request.ClientVerificationSignature;
		ClientVerificationSubmittedBy = request.ClientVerificationSubmittedBy;
	}
}
