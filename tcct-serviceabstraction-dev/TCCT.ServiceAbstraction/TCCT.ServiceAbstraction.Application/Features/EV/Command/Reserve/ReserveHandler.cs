using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Reserve;
public class ReserveHandler : ICommandHandler<ReserveCommand, ReserveResult>
{
	private readonly IEVService _evService;
	public ReserveHandler(IEVService evService)
	{
		_evService = evService;
	}
	public Task<ReserveResult> Handle(ReserveCommand request, CancellationToken cancellationToken)
	{
		return _evService.Reserve(request);
	}
}