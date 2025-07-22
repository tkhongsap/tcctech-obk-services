using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists.CheckListTasks;
public class CheckListTaskQueryHandler : IQueryHandler<CheckListTaskQuery, List<CheckListTaskResult>>
{
	private readonly ICertisService _certisservice;
	public CheckListTaskQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CheckListTaskResult>> Handle(CheckListTaskQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetCheckListTasks();
		return res;
	}
}
