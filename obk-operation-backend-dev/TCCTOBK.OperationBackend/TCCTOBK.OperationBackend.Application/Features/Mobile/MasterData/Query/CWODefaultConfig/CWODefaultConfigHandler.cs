using System.Linq;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWODefaultConfig;
public class CWODefaultConfigHandler : IQueryHandler<CWODefaultConfigQuery, CWODefaultConfigResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public CWODefaultConfigHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<CWODefaultConfigResult> Handle(CWODefaultConfigQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new CWODefaultConfigResult();
		#endregion

		var reslist = await _masterDataService.CWODefaultConfig(_apiService.MasterData.CWODefaultConfig);
		var resp = reslist.FirstOrDefault();		
		res.EnableQrScan = resp.EnableQrScan;
		res.CompletionSigDisabled = resp.CompletionSigDisabled;
		res.ClosureSigDisabled = resp.ClosureSigDisabled;
		res.ClientVerifySigDisabled = resp.ClientVerifySigDisabled;
		res.QrCodeValidationEnabled = resp.QrCodeValidationEnabled;
		res.QrCodeValidationMandatory = resp.QrCodeValidationMandatory;
		res.EnableQrScan = resp.EnableQrScan;

		//foreach (var item in resp)
		//{
		//	var m = new CWODefaultConfigResult();
		//	m.EnableQrScan = item.EnableQrScan;
		//	m.CompletionSigDisabled = item.CompletionSigDisabled;
		//	m.ClosureSigDisabled = item.ClosureSigDisabled;
		//	m.ClientVerifySigDisabled = item.ClientVerifySigDisabled;
		//	m.QrCodeValidationEnabled = item.QrCodeValidationEnabled;
		//	m.QrCodeValidationMandatory = item.QrCodeValidationMandatory;
		//	m.EnableQrScan = item.EnableQrScan;
		//	res.Add(m);
		//}

		return res;
	}
}
