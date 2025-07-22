using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists;
public class CheckListQueryHandler : IQueryHandler<CheckListQuery, List<CheckListResult>>
{
	private readonly ICertisService _certisservice;
	public CheckListQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CheckListResult>> Handle(CheckListQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetCheckLists();
		return res;
	}
}
