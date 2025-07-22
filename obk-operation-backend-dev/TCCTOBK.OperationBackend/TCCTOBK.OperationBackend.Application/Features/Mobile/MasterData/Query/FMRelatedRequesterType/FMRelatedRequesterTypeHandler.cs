using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedRequesterType;
public class FMRelatedRequesterTypeHandler : IQueryHandler<FMRelatedRequesterTypeQuery, FMRelatedRequesterTypeResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedRequesterTypeHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedRequesterTypeResult> Handle(FMRelatedRequesterTypeQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedRequesterTypeResult();
		#endregion

		var reslist = await  _masterDataService.FMRelatedRequestersTypes(_apiService.MasterData.FMRelatedRequestersTypes);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Name = resp.Name;

		return res;
	}
}
