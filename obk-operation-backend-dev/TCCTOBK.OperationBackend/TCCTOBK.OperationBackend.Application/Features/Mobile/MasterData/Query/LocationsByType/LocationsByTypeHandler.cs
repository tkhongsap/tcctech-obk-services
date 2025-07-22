using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationsByType;

public class LocationsByTypeHandler : IQueryHandler<LocationsByTypeQuery, List<LocationsByTypeResult>>
{
	private readonly IUnitOfWork _uow;

	public LocationsByTypeHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<List<LocationsByTypeResult>> Handle(LocationsByTypeQuery request, CancellationToken cancellationToken)
	{

		var locations = await _uow.LocationRepository.GetByType(request.TypeId, request.ParentId, request.Types);
		return locations.Select(x => new LocationsByTypeResult
		{
			Name = GetLocationType(x),
			LID = x.LID,
			LocationCode = x.LocationCode,
			TypeId = x.TypeId,
			Type = x.Type,
			ParentId = x.ParentLocationId,
			RefId = x.RefId
		}).ToList();
	}

	string GetLocationType(Location entity)
	{
		switch (entity.TypeId)
		{
			case 5: return entity.SiteName ?? "";
			case 4: return entity.ZoneName ?? "";
			// 8 = BuildingName
			case 8: return entity.BuildingName ?? "";
			// 1 = BuildingZoneName
			case 1: return entity.BuildingZoneName ?? "";
			case 2: return entity.FloorName ?? "";
			case 3: return entity.Space ?? "";
			case 9: return entity.Subspace ?? "";
			case 0: return entity.ZoneName ?? "";
			default: return "";
		}
	}
}
