using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.TechnicianReject;
public class TechnicianRejectCommandHandler : ICommandHandler<TechnicianRejectCommand, TechnicianRejectResult>
{
	private readonly ICertisService _certisservice;
	public TechnicianRejectCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<TechnicianRejectResult> Handle(TechnicianRejectCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.TechnicianReject(request.CwoId, request.RejectedBy, request.TechnicianId, request.OperatorNote, request.LocationId, request.Description, request.RequesterId, request.AssetId);
		return res;
	}
}
