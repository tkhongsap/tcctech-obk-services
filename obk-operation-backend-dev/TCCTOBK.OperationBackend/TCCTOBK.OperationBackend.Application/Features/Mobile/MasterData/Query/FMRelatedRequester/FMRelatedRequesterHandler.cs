using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedRequester;
public class FMRelatedRequesterHandler : IQueryHandler<FMRelatedRequesterQuery, FMRelatedRequesterResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedRequesterHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedRequesterResult> Handle(FMRelatedRequesterQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedRequesterResult();
		#endregion
		var reslist = await _masterDataService.FMRelatedRequesters(_apiService.MasterData.FMRelatedRequesters);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Name = resp.Name;
		resp.RequesterTypeId = resp.RequesterTypeId;
		resp.Email = resp.Email;

		return res;
	}
}
