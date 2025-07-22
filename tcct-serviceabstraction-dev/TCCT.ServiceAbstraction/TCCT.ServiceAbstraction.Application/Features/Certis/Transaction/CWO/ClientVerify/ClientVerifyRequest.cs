namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ClientVerify;
public class ClientVerifyRequest
{
	public int CwoId { get; set; }
	public string ClientVerificationComment { get; set; } = string.Empty;
	public string ClientVerifiedBy { get; set; } = string.Empty;
	public string ClientVerificationSignature { get; set; } = string.Empty;
	public Guid ClientVerificationSubmittedBy { get; set; }

	public ClientVerifyRequest()
	{

	}

	public ClientVerifyRequest(int cwoId, string clientVerificationComment, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy)
	{
		CwoId = cwoId;
		ClientVerificationComment = clientVerificationComment;
		ClientVerifiedBy = clientVerifiedBy;
		ClientVerificationSignature = clientVerificationSignature;
		ClientVerificationSubmittedBy = clientVerificationSubmittedBy;
	}
}
