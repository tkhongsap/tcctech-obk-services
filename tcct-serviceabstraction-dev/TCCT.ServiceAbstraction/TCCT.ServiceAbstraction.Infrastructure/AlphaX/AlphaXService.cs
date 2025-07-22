using System.Threading.Channels;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;
using TCCT.ServiceAbstraction.Application.Features.AirQuality;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetActiveFloor;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetSimpleFeedAll;

namespace TCCT.ServiceAbstraction.Infrastructure.AlphaX;
public partial class AlphaXService(IAlphaXMemoryCache cache, IAlphaXEndpointProvider endpointprovider) : IAlphaXService
{
	private IAlphaXMemoryCache _cache = cache;
	private IAlphaXEndpointProvider _endpointprovider = endpointprovider;

	public async Task<GetActiveFloorResponse> GetActiveFloor(string building)
	{
		var validstatus = new string[] { "active", "ready for service" }; // lower case only
		var res = await GetCalculatedData(building, null, null, null);
		var activefloors = res.Where(x => validstatus.Contains((x.status ?? "").ToLower()) && x.data != null && x.data.Count > 0)
			.Select(x => x.floorCode!)
			.Distinct()
			.OrderBy(x => x)
			.ToList();
		return new GetActiveFloorResponse { FloorCodes = activefloors };
	}

	public async Task<List<GetCalculatedResult>> GetCalculatedData(string building, string? floor, string? channel, string? status)
	{
		var query = await GetCalculated(building, floor, channel, status);

		var res = query.Select(x => new GetCalculatedResult
		{
			sensor = x.sensor,
			channel = x.channel,
			tag = x.tag,
			type = x.type,
			status = x.status,
			netid = x.netid,
			chid = x.chid,
			timezone = x.timezone,
			unit = x.unit,
			site = x.site,
			zone = x.zone,
			tower = x.tower,
			component = x.component,
			floor = x.floor,
			space = x.space,
			subspace = x.subspace,
			locationCode = x.locationCode,
			buildingName = x.buildingName,
			buildingCode = x.buildingCode,
			floorName = x.floorName,
			floorCode = x.floorCode,
			addressCCDD = x.addressCCDD,
			addressCode = x.addressCode,
			mainSystemName = x.mainSystemName,
			mainSystemCode = x.mainSystemCode,
			subSystemName = x.subSystemName,
			subSystemCode = x.subSystemCode,
			equipmentName = x.equipmentName,
			equipmentCode = x.equipmentCode,
			sequenceNo = x.sequenceNo,
			equipmentFullName = x.equipmentFullName,
			equipmentFullCode = x.equipmentFullCode,
			data = x.data
		}).ToList();
		return res;
	}

	public async Task<List<GetSimpleFeedAllResponse>> GetSimpleCalculatedData(string building, string? floor, string? channel, string? status)
	{
		var query = await GetCalculated(building, floor, channel, status);

		var res = query.Select(x => new GetSimpleFeedAllResponse
		{
			channel = x.channel,
			type = x.type,
			status = x.status,
			unit = x.unit,
			site = x.site,
			zone = x.zone,
			buildingName = x.buildingName,
			buildingCode = x.buildingCode,
			floorName = x.floorName,
			floorCode = x.floorCode,
			timestamp = x.data != null ? (x.data.Count > 0 ? x.data[0].timestamp : null) : null,
			value = x.data != null ? (x.data.Count > 0 ? x.data[0].value : null) : null,
		}).ToList();
		return res;
	}

	private async Task<IQueryable<GetCalculatedResponse>> GetCalculated(string building, string? floor, string? channel, string? status)
	{
		var validstatus = new string[] { "active", "ready for service" }; // lower case only
		var respres = await _cache.GetCalculatedResponseCache(building, _endpointprovider.GetCalculatedData);

		var query = respres.AsQueryable();
		var wstatus = (status ?? "").ToLower();
		switch (wstatus)
		{
			case "all": // do nothing -> select all
				break;
			case "notready":
				query = query.Where(x => !validstatus.Contains((x.status ?? "").ToLower()));
				break;
			default:
				query = query.Where(x => validstatus.Contains((x.status ?? "").ToLower()));
				break;
		}
		if (!string.IsNullOrEmpty(channel)) query = query.Where(x => string.Equals(x.channel, channel, StringComparison.OrdinalIgnoreCase));
		if (!string.IsNullOrEmpty(floor)) query = query.Where(x => string.Equals(x.floorCode, floor, StringComparison.OrdinalIgnoreCase));
		query = query.OrderBy(x => x.status); // order by เพื่อให้ Active อยู่ก่อน Ready for Service
		return query;
	}
}
