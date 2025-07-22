using System.Threading.Tasks;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceCategory;
public class FMRelatedServiceCategoryHandler : IQueryHandler<FMRelatedServiceCategoryQuery, FMRelatedServiceCategoryResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedServiceCategoryHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedServiceCategoryResult> Handle(FMRelatedServiceCategoryQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedServiceCategoryResult();
		#endregion		
		
		var reslist = await _masterDataService.FMRelatedServiceCategories(_apiService.MasterData.FMRelatedServiceCategories);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Name = resp.Name;
		resp.Description = resp.Description;

		return res;
	}
}
