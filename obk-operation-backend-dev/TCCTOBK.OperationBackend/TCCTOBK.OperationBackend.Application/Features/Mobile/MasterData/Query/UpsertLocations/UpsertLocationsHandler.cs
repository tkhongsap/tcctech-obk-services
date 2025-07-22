using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.UpsertLocations;

record LocationGroup(int ParentId, IEnumerable<LocationsResult> Children);

public class UpsertLocationsHandler : IQueryHandler<UpsertLocationsQuery, UpsertLocationsResult>
{
	readonly IAbstractionService _apiService;
	private readonly IClientSiteService _clientSiteService;
	readonly IUnitOfWork _uow;
	List<LocationsTypeResult> locationsType = new();
	List<LocationsResult> locations = new();
	Dictionary<int, LocationGroup> locatonsGroup = new();

	public UpsertLocationsHandler(IAbstractionService apiService, IUnitOfWork uow, IClientSiteService clientSiteService)
	{
		_apiService = apiService;
		_uow = uow;
		_clientSiteService = clientSiteService;
	}

	public async Task<UpsertLocationsResult> Handle(UpsertLocationsQuery request, CancellationToken cancellationToken)
	{
		locationsType = await _apiService.MasterData.GetAllLocationsType();
		locations = await _apiService.MasterData.GetAllLocation();
		locatonsGroup = locations.GroupBy(l => l.parentLocationId, l => l, (key, values) => new LocationGroup(key, values)).ToDictionary(x => x.ParentId);
		if (locatonsGroup.TryGetValue(0, out var locationGroup))
		{
			var entities = new List<Location>();
			FindChildren(new List<LocationsResult>(), locationGroup.Children, ref entities);
			var (updatedCount, insertedCount) = await _uow.LocationRepository.UpsertLocations(entities);
			await _uow.SaveChangeAsyncWithCommit();
			return new UpsertLocationsResult { InsertedRow = insertedCount, UpdatedRow = updatedCount };
		}

		return new UpsertLocationsResult();
	}

	void FindChildren(List<LocationsResult> parents, IEnumerable<LocationsResult> children, ref List<Location> entities)
	{
		foreach (var child in children)
		{
			var entity = TransForm(parents, child);
			entities.Add(entity);
			if (locatonsGroup.TryGetValue(child.id, out var locationGroup))
			{
				var location = locations.First(x => x.id == child.id);
				var currentParents = new List<LocationsResult>(parents)
				{
					location
				};
				FindChildren(currentParents, locationGroup.Children, ref entities);
			}
		}
	}

	private string GetClientSiteName(Guid csid)
	{
		if (csid == Constant.PARQ_CLIENT_SITE)
		{
			return Constant.PARQ_CLIENT_SITE_FULLNAME;
		}
		return Constant.OBK_CLIENT_SITE_FULLNAME;
	}

	Location TransForm(List<LocationsResult> parents, LocationsResult location)
	{
		var entity = new Location
		{
			LID = Guid.NewGuid(),
			LocationCode = location.locationCode ?? "",
			SiteName = GetClientSiteName(_clientSiteService.ClientSiteId),
			Type = locationsType.First(x => x.Id == location.locationTypeId).Name,
			TypeId = locationsType.First(x => x.Id == location.locationTypeId).Id,
			RefId = location.id,
			ParentLocationId = location.parentLocationId,
			CreatedBy = Guid.Empty,
			CreatedByName = "OperationBackend",
			CreatedDate = DateTime.Now,
			UpdatedBy = Guid.Empty,
			UpdatedByName = "OperationBackend",
			UpdatedDate = DateTime.Now,
		};
		foreach (var parent in parents)
		{
			GetLocationType(ref entity, parent);
		}
		GetLocationType(ref entity, location);
		return entity;
	}

	void GetLocationType(ref Location entity, LocationsResult location)
	{
		switch (location.locationTypeId)
		{
			case 5: entity.SiteName = location.name; break;
			case 4: entity.ZoneName = location.name; break;
			// 8 = BuildingName
			case 8: entity.BuildingName = location.name; break;
			// 1 = BuildingZoneName
			case 1: entity.BuildingZoneName = location.name; break;
			case 2: entity.FloorName = location.name; break;
			case 3: entity.Space = location.name; break;
			case 9: entity.Subspace = location.name; break;
		}
	}
}
