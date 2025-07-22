using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetPaymentTransaction;
public class GetPaymentTransactionCommand : ICommand<GetPaymentTransactionResult>
{
	public string TenantId { get; set; }
	public string InvoiceNo { get; set; }
}