using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceCategoryServingLocation;
public class FMRelatedServiceCategoryServingLocationHandler : IQueryHandler<FMRelatedServiceCategoryServingLocationQuery, FMRelatedServiceCategoryServingLocationResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedServiceCategoryServingLocationHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedServiceCategoryServingLocationResult> Handle(FMRelatedServiceCategoryServingLocationQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedServiceCategoryServingLocationResult();
		#endregion

		var reslist = await _masterDataService.FMRelatedServiceCategoriesServingLocations(_apiService.MasterData.FMRelatedServiceCategoriesServingLocations);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.ServiceCategoryId = resp.ServiceCategoryId;
		resp.LocationId = resp.LocationId;
		resp.SlaClassId = resp.SlaClassId;

		return res;
	}
}
