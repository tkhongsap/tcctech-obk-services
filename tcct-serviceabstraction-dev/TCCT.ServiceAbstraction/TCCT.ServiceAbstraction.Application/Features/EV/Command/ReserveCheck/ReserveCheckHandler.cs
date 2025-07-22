using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCheck;
public class ReserveCheckHandler : ICommandHandler<ReserveCheckCommand, ReserveCheckResult>
{
	private readonly IEVService _evService;
	public ReserveCheckHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<ReserveCheckResult> Handle(ReserveCheckCommand request, CancellationToken cancellationToken)
	{
		return _evService.ReserveCheck(request);
	}
}