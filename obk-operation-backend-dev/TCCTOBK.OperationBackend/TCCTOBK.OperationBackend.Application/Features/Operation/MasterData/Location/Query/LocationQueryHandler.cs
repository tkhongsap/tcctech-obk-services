using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Query;
public class LocationQueryHandler : IQueryHandler<LocationQuery, LocationResult>
{
	private readonly IAbstractionService _apiService;
	private readonly IMasterDataService _masterDataService;
	public LocationQueryHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
	{
		_apiService = apiService;
		_masterDataService = masterDataSevice;
	}
	public async Task<LocationResult> Handle(LocationQuery request, CancellationToken cancellationToken)
	{
		var result = await Task.WhenAll(GetLocation());

		if (request.LocationId.HasValue)
		{
			result = await Task.WhenAll(GetLocation(request.LocationId.Value));
		}

		if (result == null)
		{
			return new LocationResult(new List<LocationItem>());
		}

		var data = new List<LocationItem>();

		foreach (var item in result)
		{
			data.AddRange(item);
		}
		return new LocationResult(data);
	}
	private async Task<List<LocationItem>> GetLocation()
	{
		var result = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);
		return result.Select(x => new LocationItem(x)).ToList();
	}
	private async Task<List<LocationItem>> GetLocation(int id)
	{
		var result = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);
		return result.Where(x => x.id == id).Select(x => new LocationItem(x)).ToList();
	}
}
