using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMSupervisor;
public class FMRelatedFMSupervisorHandler : IQueryHandler<FMRelatedFMSupervisorQuery, FMRelatedFMSupervisorResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedFMSupervisorHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedFMSupervisorResult> Handle(FMRelatedFMSupervisorQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedFMSupervisorResult();
		#endregion

		var reslist = await _masterDataService.FMRelatedFMSupervisors(_apiService.MasterData.FMRelatedFMSupervisors);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.Email = resp.Email;
		resp.FullName = resp.FullName;
		resp.FirstName = resp.FirstName;
		resp.LastName = resp.LastName;
		resp.Disabled = resp.Disabled;

		return res;
	}
}
