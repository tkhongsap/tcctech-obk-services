using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupervisorReject;
public class SupervisorRejectCommandHandler : ICommandHandler<SupervisorRejectCommand, SupervisorRejectResult>
{
	private readonly ICertisService _certisservice;
	public SupervisorRejectCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<SupervisorRejectResult> Handle(SupervisorRejectCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.SupervisorReject(request.CwoId, request.RejectedBy, request.LocationId, request.Description, request.RequesterId, request.AssetId);
		return res;
	}
}
