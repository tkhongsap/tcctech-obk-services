using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Technicians;
public class TechniciansQueryHandler : IQueryHandler<TechniciansQuery, List<TechniciansResult>>
{
	private readonly ICertisService _certisservice;
	public TechniciansQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<TechniciansResult>> Handle(TechniciansQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.Technicians(request.Id);
		return res;
	}
}
