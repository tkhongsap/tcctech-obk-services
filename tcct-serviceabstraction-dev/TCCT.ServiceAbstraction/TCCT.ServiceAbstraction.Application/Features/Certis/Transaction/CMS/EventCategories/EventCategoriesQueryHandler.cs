using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventCategories;
public class EventCategoriesQueryHandler : IQueryHandler<EventCategoriesQuery, List<EventCategoriesResult>>
{
	private readonly ICertisService _certisservice;

	public EventCategoriesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<EventCategoriesResult>> Handle(EventCategoriesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetEventCategories();
		return res;
	}
}
