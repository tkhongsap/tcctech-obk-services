using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedProblemType;
public class FMRelatedProblemTypeHandler : IQueryHandler<FMRelatedProblemTypeQuery, FMRelatedProblemTypeResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedProblemTypeHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedProblemTypeResult> Handle(FMRelatedProblemTypeQuery request, CancellationToken cancellationToken)
	{ 
		#region Initail Response
		var res = new FMRelatedProblemTypeResult();
		#endregion

		var reslist = await _masterDataService.ProblemTypes(_apiService.MasterData.ProblemTypes);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Name = resp.Name;
		resp.PriorityId = resp.PriorityId;
		resp.ServiceCategoryId = resp.ServiceCategoryId;
		resp.ChecklistId = resp.ChecklistId;

		return res;
	}
}
