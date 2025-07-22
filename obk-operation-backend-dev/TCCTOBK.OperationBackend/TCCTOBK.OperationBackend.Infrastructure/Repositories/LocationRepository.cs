using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.LocationRepository;
using TCCTOBK.OperationBackend.Application.Helper.Service;

namespace TCCTOBK.OperationBackend.Infrastructure;

public class LocationRepository : BaseRepository<Location>, ILocationRepository
{

	private readonly IClientSiteService _clientSiteService;

	public LocationRepository(ITCCTOBKContext context, IClientSiteService clientSiteService) : base(context)
	{
		_clientSiteService = clientSiteService;
	}

	public async Task<Guid> CreateLocation(CreateLocationModel data, AuditableModel auditable)
	{
		var newLocationId = Guid.NewGuid();
		var newLocation = new Location()
		{
			LID = newLocationId,
			SiteName = data.SiteName,
			ZoneName = data.ZoneName,
			BuildingName = data.BuildingName,
			BuildingZoneName = data.BuildingZoneName,
			FloorName = data.FloorName,
			Type = data.Type,
			CreatedBy = auditable.CreatedBy,
			CreatedByName = auditable.CreatedByName!,
			CreatedDate = auditable.CreatedDate,
			UpdatedBy = auditable.UpdatedBy,
			UpdatedByName = auditable.UpdatedByName!,
			UpdatedDate = auditable.UpdatedDate,
			CSID = _clientSiteService.ClientSiteId
		};
		Db.Add(newLocation);
		return newLocationId;
	}

	public async Task UpdateLocation(UpdateLocationModel data, AuditableModel auditable)
	{
		var fLocation = await Db.AsTracking().FirstOrDefaultAsync(x => x.LID == data.LID) ?? throw new NotFoundException("ไม่พบ Location");
		if (data.SiteName != null) fLocation.SiteName = data.SiteName;
		if (data.ZoneName != null) fLocation.ZoneName = data.ZoneName;
		if (data.BuildingName != null) fLocation.BuildingName = data.BuildingName;
		if (data.BuildingZoneName != null) fLocation.BuildingZoneName = data.BuildingZoneName;
		if (data.FloorName != null) fLocation.FloorName = data.FloorName;
		if (data.Type != null) fLocation.Type = data.Type;
		fLocation.UpdatedBy = auditable.UpdatedBy;
		fLocation.UpdatedByName = auditable.UpdatedByName!;
		fLocation.UpdatedDate = auditable.UpdatedDate;
		fLocation.CSID = _clientSiteService.ClientSiteId;
	}

	public async Task<int> RemoveLocation(Guid lid)
	{
		return await Db.Where(x => x.LID == lid && x.CSID == _clientSiteService.ClientSiteId).ExecuteDeleteAsync();
	}

	public Task<List<Location>> GetAll(Guid? lid, string? filter, List<Guid>? idList, string? types, TableState state)
	{
		var query = GetAllQueryBuilder(lid, filter, idList, types);
		// if (!string.IsNullOrEmpty(state.OrderingName))
		// {
		// 	query = query.OrderBy(state.OrderingName);
		// }
		return query.Skip(state.Skip).Take(state.Take).ToListAsync();
	}

	private IQueryable<Location> GetAllQueryBuilder(Guid? lid, string? filter, List<Guid>? idList, string? types)
	{
		var query = Db.AsQueryable();
		if (lid != null)
		{
			query = query.Where(x => x.LID == lid);
		}
		if (!string.IsNullOrEmpty(filter))
		{
			query = query.Where(x => x.LID.ToString().ToLower().Contains(filter.ToLower()) || x.SiteName.ToLower().Contains(filter.ToLower()) || x.ZoneName!.ToLower().Contains(filter.ToLower()) || x.BuildingName!.ToLower().Contains(filter.ToLower()) || x.BuildingZoneName!.ToLower().Contains(filter.ToLower()) || x.FloorName!.ToLower().Contains(filter.ToLower()));
		}
		if (idList != null && idList.Count > 0)
		{
			query = query.Where(x => idList.Contains(x.LID));
		}
		if (types != null)
		{
			var typesList = types.Split(',');
			query = query.Where(x => typesList.Contains(x.TypeId.ToString()) || typesList.Contains(x.Type));
		}
		return query;
	}
	public Task<int> GetAllCount(Guid? lid, string? filter, List<Guid>? idList, string? types)
	{
		var query = GetAllQueryBuilder(lid, filter, idList, types);
		return query.CountAsync();
	}
	private IQueryable<Location> GetByIdQueryBuilder()
	{
		var query = Db.AsTracking();
		return query;
	}
	public async Task<Location> GetById(Guid id)
	{
		var query = GetByIdQueryBuilder();
		var result = await query.FirstOrDefaultAsync(x => x.LID == id);
		if (result == null) throw new NotFoundException("ไม่พบ Location");
		return result;
	}

	public async Task<Location?> GetByRefId(int refId)
	{
		var result = await Db.Where(x => x.RefId == refId).FirstOrDefaultAsync();
		return result;
	}

	public Task<List<Location>> GetByType(int? typeId, int? parentId, string? types)
	{
		var query = Db.AsQueryable();
		if (typeId != null)
		{
			query = query.Where(x => x.TypeId == typeId);
		}
		if (parentId != null)
		{
			query = query.Where(x => x.ParentLocationId == parentId);
		}
		if (types != null)
		{
			var typesList = types.Split(',');
			query = query.Where(x => typesList.Contains(x.TypeId.ToString()) || typesList.Contains(x.Type));
		}
		return query.ToListAsync();
	}

	public async Task<(int, int)> UpsertLocations(List<Location> locations)
	{
		int updatedCount = 0;
		int insertedCount = 0;
		var existLocationsDic = await Db.Where(x => x.RefId != null).ToDictionaryAsync(x => x.RefId!.Value);
		foreach (var location in locations)
		{
			if (location.RefId != null && existLocationsDic.TryGetValue(location.RefId!.Value, out var entity))
			{
				location.LID = entity.LID;
				location.CSID = _clientSiteService.ClientSiteId;
				Context.Entry(location).State = EntityState.Modified;
				updatedCount++;
			}
			else
			{
				location.CSID = _clientSiteService.ClientSiteId;
				Db.Add(location);
				insertedCount++;
			}
		}

		return (updatedCount, insertedCount);
	}

	public async Task<string> GetLocationFullnamebyRefId(int refId)
	{
		var result = await Db.Where(x => x.RefId == refId).FirstOrDefaultAsync();
		if (result == null) return "-";
		var locationName = $"{result.SiteName}";

		if (result.ZoneName != null)
		{
			locationName += $" / {result.ZoneName}";
		}

		if (result.BuildingName != null)
		{
			locationName += $" / {result.BuildingName}";
		}

		if (result.BuildingZoneName != null)
		{
			locationName += $" / {result.BuildingZoneName}";
		}

		if (result.FloorName != null)
		{
			locationName += $" / {result.FloorName}";
		}
		return locationName;
	}

	public Task<List<Location>> GetAll()
	{
		var locations = Db.Where(x => x.RefId != null).ToListAsync();
		return locations;
	}

}
