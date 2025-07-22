using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
public class DmsImageByIdQueryHandler : IQueryHandler<DmsImageByIdQuery, DmsImageByIdResult>
{
	private readonly ICertisService _certisservice;
	public DmsImageByIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<DmsImageByIdResult> Handle(DmsImageByIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.DMSService.GetDMSImageById(request.Id);
		return res;
	}
}
