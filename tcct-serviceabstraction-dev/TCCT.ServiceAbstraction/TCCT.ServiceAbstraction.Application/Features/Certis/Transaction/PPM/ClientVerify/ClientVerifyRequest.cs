namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ClientVerify;
public class ClientVerifyRequest
{
	public int WorkOrderId { get; set; }
	public string ClientVerificationComment { get; set; } = null!;
	public string ClientVerifiedBy { get; set; } = null!;
	public string ClientVerificationSignature { get; set; } = null!;
	public Guid ClientVerificationSubmittedBy { get; set; }

	public ClientVerifyRequest()
	{

	}

	public ClientVerifyRequest(int workOrderId, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy)
	{
		WorkOrderId = workOrderId;
		ClientVerificationComment = clientVerifiedBy;
		ClientVerifiedBy = clientVerifiedBy;
		ClientVerificationSignature = clientVerificationSignature;
		ClientVerificationSubmittedBy = clientVerificationSubmittedBy;
	}
}
