using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Icons;
public class IconHandler : IQueryHandler<IconQuery, List<IconResult>>
{
	private readonly ICertisService _certisservice;
	public IconHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<IconResult>> Handle(IconQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetIcons();
	}
}
