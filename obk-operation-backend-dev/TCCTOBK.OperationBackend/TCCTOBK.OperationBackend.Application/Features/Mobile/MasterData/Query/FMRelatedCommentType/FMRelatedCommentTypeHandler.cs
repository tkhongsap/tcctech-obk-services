using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedCommentType;
public class FMRelatedCommentTypeHandler : IQueryHandler<FMRelatedCommentTypeQuery, FMRelatedCommentTypeResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedCommentTypeHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedCommentTypeResult> Handle(FMRelatedCommentTypeQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedCommentTypeResult();
		#endregion

		var reslist = await _masterDataService.FMRelatedCommentTypes(_apiService.MasterData.FMRelatedCommentTypes);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Name = resp.Name;
		return res;
	}
}