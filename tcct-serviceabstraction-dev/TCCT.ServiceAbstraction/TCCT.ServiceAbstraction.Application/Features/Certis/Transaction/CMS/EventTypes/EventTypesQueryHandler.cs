using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventTypes;
public class EventTypesQueryHandler : IQueryHandler<EventTypesQuery, List<EventTypesResult>>
{
	private readonly ICertisService _certisservice;
	public EventTypesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<EventTypesResult>> Handle(EventTypesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetEventTypes();
		return res;
	}
}
