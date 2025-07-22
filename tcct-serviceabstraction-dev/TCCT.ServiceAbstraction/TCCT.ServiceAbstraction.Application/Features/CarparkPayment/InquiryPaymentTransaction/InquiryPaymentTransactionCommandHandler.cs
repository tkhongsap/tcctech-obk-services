using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.InquiryPaymentTransaction;

public sealed class InquiryPaymentTransactionCommandHandler : ICommandHandler<InquiryPaymentTransactionCommand, InquiryPaymentTransactionResult>
{
	private readonly ICarparkPaymentService _service;
	public InquiryPaymentTransactionCommandHandler(ICarparkPaymentService service)
	{
		_service = service;
	}

	public async Task<InquiryPaymentTransactionResult> Handle(InquiryPaymentTransactionCommand request, CancellationToken cancellationToken)
	{
		return await _service.InquiryPaymentTransaction(request.TransactionNo, request.SubCode);
	}

}

