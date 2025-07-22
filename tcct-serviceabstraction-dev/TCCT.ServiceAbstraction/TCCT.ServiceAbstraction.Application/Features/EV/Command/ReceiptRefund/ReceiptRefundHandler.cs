using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReceiptRefund;
public class ReceiptRefundHandler : ICommandHandler<ReceiptRefundCommand, ReceiptRefundResult>
{
	private readonly IEVService _evService;
	public ReceiptRefundHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<ReceiptRefundResult> Handle(ReceiptRefundCommand request, CancellationToken cancellationToken)
	{
		return _evService.ReceiptRefund(request);
	}
}