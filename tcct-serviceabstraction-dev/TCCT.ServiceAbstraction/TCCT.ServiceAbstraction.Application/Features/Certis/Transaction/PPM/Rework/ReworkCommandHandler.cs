using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Rework;
public class ReworkCommandHandler : ICommandHandler<ReworkCommand, ReworkResult>
{
	private readonly ICertisService _certisservice;
	public ReworkCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<ReworkResult> Handle(ReworkCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.Rework(request.WoId, request.ReasonToRework, request.ReworkRequestedBy);
		return res;
	}
}
