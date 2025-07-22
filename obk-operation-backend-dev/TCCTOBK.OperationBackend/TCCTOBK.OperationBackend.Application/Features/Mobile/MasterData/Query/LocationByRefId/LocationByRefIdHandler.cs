using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.LocationByRefId;

public class LocationByRefIdHandler : IQueryHandler<LocationByRefIdQuery, LocationByRefIdResult>
{
	private readonly IUnitOfWork _uow;

	public LocationByRefIdHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<LocationByRefIdResult> Handle(LocationByRefIdQuery request, CancellationToken cancellationToken)
	{
		var location = await _uow.LocationRepository.GetByRefId(request.RefId);
		if (location == null)
		{
			throw new NotFoundException("Location not found");
		}
		return new LocationByRefIdResult
		{
			Name = GetLocationType(location),
			LID = location.LID,
			LocationCode = location.LocationCode,
			TypeId = location.TypeId,
			Type = location.Type,
			ParentId = location.ParentLocationId,
			RefId = location.RefId
		};
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
			default: return "";
		}
	}
}
