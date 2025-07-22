using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.AlldataDetailsReceipt;

public sealed class AlldataDetailsReceiptCommandHandler : ICommandHandler<AlldataDetailsReceiptCommand, List<AlldataDetailsReceiptResult>>
{
	private readonly ICarparkPaymentService _service;
	public AlldataDetailsReceiptCommandHandler(ICarparkPaymentService service)
	{
		_service = service;
	}

	public async Task<List<AlldataDetailsReceiptResult>> Handle(AlldataDetailsReceiptCommand request, CancellationToken cancellationToken)
	{
		return await _service.AlldataDetailsReceipt(request.LogId);
	}

}

