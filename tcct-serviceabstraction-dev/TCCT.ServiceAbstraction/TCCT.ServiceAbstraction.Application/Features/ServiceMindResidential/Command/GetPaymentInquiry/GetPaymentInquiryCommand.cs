using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetPaymentInquiry;
public class GetPaymentInquiryCommand : ICommand<GetPaymentInquiryResult>
{
	public string TenantId { get; set; }
	public string TransactionNo { get; set; }
	public string SubCode { get; set; }
}