using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMSupervisorService;
public class FMRelatedFMSupervisorServiceHandler : IQueryHandler<FMRelatedFMSupervisorServiceQuery, FMRelatedFMSupervisorServiceResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedFMSupervisorServiceHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedFMSupervisorServiceResult> Handle(FMRelatedFMSupervisorServiceQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedFMSupervisorServiceResult();
		#endregion
		var reslist = await _masterDataService.FMRelatedFMSupervisorsServices(_apiService.MasterData.FMRelatedFMSupervisorsServices);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.SupervisorId = resp.SupervisorId;
		resp.LocationId = resp.LocationId;
		resp.IsDefault = resp.IsDefault;

		return res;
	}
}
