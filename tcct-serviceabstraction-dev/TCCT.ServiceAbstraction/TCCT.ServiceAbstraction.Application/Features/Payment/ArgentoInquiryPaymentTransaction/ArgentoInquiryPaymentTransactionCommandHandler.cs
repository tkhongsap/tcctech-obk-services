using TCCT.ServiceAbstraction.Application.Contracts.Payment;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;


namespace TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;

public sealed class ArgentoInquiryPaymentTransactionCommandHandler : ICommandHandler<ArgentoInquiryPaymentTransactionCommand, ArgentoInquiryPaymentTransactionResult>
{
	private readonly IPaymentService _service;
	public ArgentoInquiryPaymentTransactionCommandHandler(IPaymentService service)
	{
		_service = service;
	}

	public async Task<ArgentoInquiryPaymentTransactionResult> Handle(ArgentoInquiryPaymentTransactionCommand request, CancellationToken cancellationToken)
	{
		return await _service.ArgentoInquiryPaymentTransaction(request.TransactionNo, request.SubCode);
	}

}