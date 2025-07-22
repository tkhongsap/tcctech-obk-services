using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.FrequencyTypes;
public class FrequencyTypeQueryHandler : IQueryHandler<FrequencyTypeQuery, List<FrequencyTypeResult>>
{
	private readonly ICertisService _certisservice;
	public FrequencyTypeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<FrequencyTypeResult>> Handle(FrequencyTypeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.PPM.GetFrequencyTypes();
		return res;
	}
}
