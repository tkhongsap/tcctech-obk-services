using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ClientVerify;
public class ClientVerifyCommand : ICommand<ClientVerifyResult>
{
	public int WoId { get; set; }
	public string ClientVerificationComment { get; set; } = null!;
	public string ClientVerifiedBy { get; set; } = null!;
	public string ClientVerificationSignature { get; set; } = null!;
	public Guid ClientVerificationSubmittedBy { get; set; }

	public ClientVerifyCommand(ClientVerifyRequest request)
	{
		WoId = request.WorkOrderId;
		ClientVerificationComment = request.ClientVerificationComment;
		ClientVerifiedBy = request.ClientVerifiedBy;
		ClientVerificationSignature = request.ClientVerificationSignature;
		ClientVerificationSubmittedBy = request.ClientVerificationSubmittedBy;
	}
}
