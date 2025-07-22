using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
public class CWOCommandHandler : ICommandHandler<CWOCommand, CWOResult>
{
	private readonly ICertisService _certisservice;
	public CWOCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CWOResult> Handle(CWOCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.CWO(request.RequestedOn, request.RequesterId, request.CwoTypeId, request.ProblemTypeId, request.PriorityId, request.ServiceCategoryId, request.LocationId, request.CreatedBy, request.Description, request.AssetId);
		return res;
	}
}
