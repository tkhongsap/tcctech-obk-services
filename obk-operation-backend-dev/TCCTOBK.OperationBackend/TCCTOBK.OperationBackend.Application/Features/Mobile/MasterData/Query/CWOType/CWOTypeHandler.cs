using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOType;
public class CWOTypeHandler : IQueryHandler<CWOTypeQuery, List<CWOTypeResult>>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public CWOTypeHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<List<CWOTypeResult>> Handle(CWOTypeQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new List<CWOTypeResult>();
		#endregion

		var reslist = await _apiService.MasterData.CWOType();
		res = reslist.Select(x => new CWOTypeResult()
		{
			Id = x.Id,
			Name = x.Name
		}).ToList();
		return res;
	}
}

