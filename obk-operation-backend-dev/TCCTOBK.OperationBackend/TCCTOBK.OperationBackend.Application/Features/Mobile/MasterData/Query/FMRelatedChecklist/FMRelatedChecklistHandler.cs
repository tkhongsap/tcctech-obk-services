using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedChecklist;
public class FMRelatedChecklistHandler : IQueryHandler<FMRelatedChecklistQuery, FMRelatedChecklistResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedChecklistHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedChecklistResult> Handle(FMRelatedChecklistQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedChecklistResult();
		#endregion

		var reslist = await _masterDataService.FMRelatedChecklists(_apiService.MasterData.FMRelatedChecklists);
		var resp = reslist.FirstOrDefault();
		resp.Name = resp.Name;
		resp.ChecklistNo = resp.ChecklistNo;
		resp.TotalDuration = resp.TotalDuration;
		resp.AllLocations = resp.AllLocations;

		//foreach (var item in reslist)
		//{
		//	var m = new FMRelatedChecklistResult();
		//	m.Name = item.Name;
		//	m.ChecklistNo = item.ChecklistNo;
		//	m.TotalDuration = item.TotalDuration;
		//	m.AllLocations = item.AllLocations;
		//	res.Add(m);
		//}
		return res;
	}
}