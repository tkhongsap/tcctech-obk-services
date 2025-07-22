using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedPriority;
public class FMRelatedPriorityHandler : IQueryHandler<FMRelatedPriorityQuery, FMRelatedPriorityResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedPriorityHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedPriorityResult> Handle(FMRelatedPriorityQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedPriorityResult();
		#endregion
		
		var reslist = await _masterDataService.FMRelatedPriorities(_apiService.MasterData.FMRelatedPriorities);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Name = resp.Name;
		resp.ColorCode = resp.ColorCode;
		resp.IsCritical = resp.IsCritical;

		return res;
	}
}
