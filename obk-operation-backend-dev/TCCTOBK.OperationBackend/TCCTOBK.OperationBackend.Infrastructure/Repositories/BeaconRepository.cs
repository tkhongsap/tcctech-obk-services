using Microsoft.EntityFrameworkCore;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Model;
using TCCTOBK.OperationBackend.Application.Repositories;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Infrastructure.Repositories;

public class BeaconRepository : BaseRepository<mtBeacon>, IBeaconRepository
{
	public BeaconRepository(ITCCTOBKContext context) : base(context) { }

	public Task<List<BeaconModel>> GetBeaconsListAsync()
	{
		return Db.Where(x => x.IsActive).Select(x => new BeaconModel
		{
			UUID = x.UUID,
			Major = x.Major,
			Minor = x.Minor,
			Latitude = x.Latitude,
			Longitude = x.Longitude,
			FloorName = x.FloorName,
			ParkName = x.ParkName,
			SpaceNo = x.SpaceNo,
			SpaceType = x.SpaceType,
			ZoneName = x.ZoneName
		}).ToListAsync();
	}

	public async Task<BeaconModel> GetBeaconByUUIDAsync(string uuid)
	{
		var result = await Db.Where(x => x.UUID == uuid).Select(x => new BeaconModel
		{
			UUID = x.UUID,
			Major = x.Major,
			Minor = x.Minor,
			Latitude = x.Latitude,
			Longitude = x.Longitude,
			FloorName = x.FloorName,
			ParkName = x.ParkName,
			SpaceNo = x.SpaceNo,
			SpaceType = x.SpaceType,
			ZoneName = x.ZoneName
		}).FirstOrDefaultAsync();

		if (result == null)
		{
			throw new NotFoundException("Beacon not found.");
		}
		return result;
	}
}
