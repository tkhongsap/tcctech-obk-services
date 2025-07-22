using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query. FMRelatedFMTechnician;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMTechnician;
public class FMRelatedFMTechnicianHandler : IQueryHandler<FMRelatedFMTechnicianQuery,  FMRelatedFMTechnicianResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedFMTechnicianHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task< FMRelatedFMTechnicianResult> Handle( FMRelatedFMTechnicianQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new  FMRelatedFMTechnicianResult();
		#endregion

		var reslist = await _masterDataService.FMRelatedFMTechnicians(_apiService.MasterData.FMRelatedFMTechnicians);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Email = resp.Email;
		resp.Mobile = resp.Mobile;
		resp.FullName = resp.FullName;
		resp.FirstName = resp.FirstName;
		resp.LastName = resp.LastName;
		resp.Disabled = resp.Disabled;

		return res;
	}
}
