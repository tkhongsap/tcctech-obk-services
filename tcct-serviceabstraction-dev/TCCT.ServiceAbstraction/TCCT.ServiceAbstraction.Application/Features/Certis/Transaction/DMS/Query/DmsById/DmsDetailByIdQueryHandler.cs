using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
public class DmsDetailByIdQueryHandler : IQueryHandler<DmsDetailByIdQuery, DmsDetailByIdResult>
{
	private readonly ICertisService _certisservice;
	public DmsDetailByIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<DmsDetailByIdResult> Handle(DmsDetailByIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.DMSService.GetDmsDetailById(request.Id);
		return res;
	}
}
