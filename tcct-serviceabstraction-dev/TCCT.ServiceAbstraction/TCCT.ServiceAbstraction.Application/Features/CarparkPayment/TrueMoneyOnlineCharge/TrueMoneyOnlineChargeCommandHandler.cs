using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.TrueMoneyOnlineCharge;

public sealed class TrueMoneyOnlineChargeCommandHandler : ICommandHandler<TrueMoneyOnlineChargeCommand, TrueMoneyOnlineChargeResult>
{
	private readonly ICarparkPaymentService _service;
	public TrueMoneyOnlineChargeCommandHandler(ICarparkPaymentService service)
	{
		_service = service;
	}

	public async Task<TrueMoneyOnlineChargeResult> Handle(TrueMoneyOnlineChargeCommand request, CancellationToken cancellationToken)
	{
		var srcres = await _service.ArgentoPaymentSource(request.InvoiceNo, request.Description, request.Amount, "THB", "TrueMoney (C scan B - Offline)");
		return await _service.ArgentoChargeTrueMoneyOnline(request.Description, srcres.sourceId, 5, "");
	}

}

