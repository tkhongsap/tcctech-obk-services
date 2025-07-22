using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCancel;
public class ReserveCancelHandler : ICommandHandler<ReserveCancelCommand, ReserveCancelResult>
{
	private readonly IEVService _evService;
	public ReserveCancelHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<ReserveCancelResult> Handle(ReserveCancelCommand request, CancellationToken cancellationToken)
	{
		return _evService.ReserveCancel(request);
	}
}