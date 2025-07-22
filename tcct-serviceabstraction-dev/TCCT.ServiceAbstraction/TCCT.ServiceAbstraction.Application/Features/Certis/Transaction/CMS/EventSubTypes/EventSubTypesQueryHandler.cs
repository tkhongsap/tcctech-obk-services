using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventSubTypes;
public class EventSubTypesQueryHandler : IQueryHandler<EventSubTypesQuery, List<EventSubTypesResult>>
{
	private readonly ICertisService _certisservice;
	public EventSubTypesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<EventSubTypesResult>> Handle(EventSubTypesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetEventSubTypes();
		return res;
	}
}
