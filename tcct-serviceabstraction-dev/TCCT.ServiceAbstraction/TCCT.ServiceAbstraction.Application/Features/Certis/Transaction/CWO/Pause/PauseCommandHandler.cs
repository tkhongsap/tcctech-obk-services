using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Pause;
public class PauseCommandHandler : ICommandHandler<PauseCommand, PauseResult>
{
	private readonly ICertisService _certisservice;
	public PauseCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<PauseResult> Handle(PauseCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.Pause(request.CwoId, request.PausedBy, request.Reason);
		return res;
	}
}
