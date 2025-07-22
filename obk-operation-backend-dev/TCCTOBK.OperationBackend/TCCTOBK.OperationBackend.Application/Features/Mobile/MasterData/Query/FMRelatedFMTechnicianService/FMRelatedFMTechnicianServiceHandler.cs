using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMTechnicianService;
public class FMRelatedFMTechnicianServiceHandler : IQueryHandler<FMRelatedFMTechnicianServiceQuery, FMRelatedFMTechnicianServiceResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;

	public FMRelatedFMTechnicianServiceHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}

	public async Task<FMRelatedFMTechnicianServiceResult> Handle(FMRelatedFMTechnicianServiceQuery request, CancellationToken cancellationToken)
	{
		#region Initail Response
		var res = new FMRelatedFMTechnicianServiceResult();
		#endregion

		var reslist = await _masterDataService.FMRelatedFMTechniciansServices(_apiService.MasterData.FMRelatedFMTechniciansServices);
		var resp = reslist.FirstOrDefault();
		resp.Id = resp.Id;
		resp.TechnicianId = resp.TechnicianId;
		resp.LocationId = resp.LocationId;
		resp.ServiceCategoryId = resp.ServiceCategoryId;

		return res;
	}
}
