using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.FMTechnician.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.FMTechnician.Query;
public class FMTechnicianQueryHandler : IQueryHandler<FMTechnicianQuery, FMTechnicianResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;
	public FMTechnicianQueryHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}
	public async Task<FMTechnicianResult> Handle(FMTechnicianQuery request, CancellationToken cancellationToken)
	{
		var result = await Task.WhenAll(GetFMTechnician());

		if (!string.IsNullOrEmpty(request.FMTechnicianId))
		{
			result = await Task.WhenAll(GetFMTechnician(request.FMTechnicianId));
		}

		if (result == null)
		{
			return new FMTechnicianResult(new List<FMTechnicianItem>());
		}

		var data = new List<FMTechnicianItem>();

		foreach (var item in result)
		{
			data.AddRange(item);
		}
		return new FMTechnicianResult(data);
	}
	private async Task<List<FMTechnicianItem>> GetFMTechnician()
	{
		var result = await _masterDataService.GetAllFMTechnician(_apiService.MasterData.GetAllFMTechnician);
		return result.Select(x => new FMTechnicianItem(x)).ToList();
	}
	private async Task<List<FMTechnicianItem>> GetFMTechnician(string id)
	{
		var result = await _masterDataService.GetAllFMTechnician(_apiService.MasterData.GetAllFMTechnician);
		return result.Where(x => x.Id == id).Select(x => new FMTechnicianItem(x)).ToList();
	}
}
