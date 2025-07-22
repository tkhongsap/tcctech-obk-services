using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOStatusCode;
public class CWOStatusCodeHandler : IQueryHandler<CWOStatusCodeQuery, CWOStatusCodeResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public CWOStatusCodeHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<CWOStatusCodeResult> Handle(CWOStatusCodeQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new CWOStatusCodeResult();
		#endregion

		var reslist = await _masterDataService.CWOStatusCode(_apiService.MasterData.CWOStatusCode);
		var resp = reslist.FirstOrDefault(x => x.Id == request.Id);
		res.Id = resp.Id;
		res.Name = resp.Name;

		return res;

	}
}

