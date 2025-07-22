using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GenerateReceipt;

public sealed class GenerateReceiptCommandHandler : ICommandHandler<GenerateReceiptCommand, GenerateReceiptResult>
{
	private readonly ICarparkPaymentService _service;
	public GenerateReceiptCommandHandler(ICarparkPaymentService service)
	{
		_service = service;
	}

	public async Task<GenerateReceiptResult> Handle(GenerateReceiptCommand request, CancellationToken cancellationToken)
	{
		return await _service.GenerateReceipt(request.LogId, request.PaymentId, request.Type, request.SubCode);
	}

}

