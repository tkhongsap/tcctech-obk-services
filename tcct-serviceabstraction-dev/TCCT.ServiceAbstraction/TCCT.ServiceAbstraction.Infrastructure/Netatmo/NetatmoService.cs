using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpsertUserToken;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SetState;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SwitchHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeStatus;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.Scenario;
using TCCT.ServiceAbstraction.Domain.Netatmo.Entities;
using MediatR;

namespace TCCT.ServiceAbstraction.Infrastructure.Netatmo;
public class NetatmoService : INetatmoService
{
	INetatmoEndpointProvider _endpointprovider;
	INetatmoMemoryCache _cache;

	public NetatmoService(INetatmoMemoryCache cache, INetatmoEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, float awayTemp, float hgTemp, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId)
	{
		return _endpointprovider.CreateNewHomeSchedule(homeId, name, awayTemp, hgTemp, timetable, zones, tenantId);
	}

	public Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, string scheduleType, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId)
	{
		return _endpointprovider.CreateNewHomeSchedule(homeId, name, scheduleType, timetable, zones, tenantId);
	}

	public Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, float coolingAwayTemp, string scheduleType, bool selected, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId)
	{
		return _endpointprovider.CreateNewHomeSchedule(homeId, name, coolingAwayTemp, scheduleType, selected, timetable, zones, tenantId);
	}

	public Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, string scheduleType, List<TimeTableType> timetable, List<ZoneType> zones, List<TimetableSunType> timeTableSunrise, List<TimetableSunType> timeTableSunset, string? tenantId)
	{
		return _endpointprovider.CreateNewHomeSchedule(homeId, name, scheduleType, timetable, zones, timeTableSunrise, timeTableSunset, tenantId);
	}

	public async Task<HomeDataResult> GetHomeData(string homeId, string? tenantId)
	{
		return await _endpointprovider.GetHomeData(homeId, tenantId);
	}

	public async Task<HomeStatusResult> GetHomeStatus(string homeId, string? tenantId)
	{
		return await _endpointprovider.GetHomeStatus(homeId, tenantId);
	}

	public async Task<ScenariosResult> GetScenarios(string homeId, string? tenantId)
	{
		return await _endpointprovider.GetScenarios(homeId, tenantId);
	}

	public async Task<SwitchHomeScheduleResult> PostSwitchHomeSchedule(string operation, string homeid, string scheduleid, string scheduletype, bool selected, string? tenantId)
	{
		return await _endpointprovider.PostSwitchHomeSchedule(operation, homeid, scheduleid, scheduletype, selected, tenantId);
	}

	public Task<SetStateResult> SetState(string id, List<Application.Features.Netatmo.Command.SetState.Room> rooms, string operation, string? tenantId)
	{
		return _endpointprovider.SetState(id, rooms, operation, tenantId);
	}

	public Task<SetStateResult> SetState(string id, List<Application.Features.Netatmo.Command.SetState.Module> modules, string operation, string? tenantId)
	{
		return _endpointprovider.SetState(id, modules, operation, tenantId);
	}

	public async Task<SynchomeScheduleResult> SetSynchomeschedule(string home_id, string schedule_id, string name, string schedule_type, float? cooling_away_temp,List<TimetableSunType>? timetable_sunrise,List<TimetableSunType>? timetable_sunset, List<Application.Features.Netatmo.Command.Synchomeschedule.Timetable> timetable, List<Application.Features.Netatmo.Command.Synchomeschedule.Zone> zones, string? tenantId)
	{
		return await _endpointprovider.SetSynchomeschedule(home_id, schedule_id, name, schedule_type, cooling_away_temp, timetable_sunrise, timetable_sunset, timetable, zones, tenantId);
	}

	public async Task<List<user_token_mapping>> GetUserTokenList(string? tenantId, string? homeId) 
	{
		return await _endpointprovider.GetUserTokenList(tenantId, homeId);
	}

	public async Task<(int Inserted, int Updated)> UpsertUserToken(UpsertUserTokenData request)
	{
		return await _endpointprovider.UpsertUserToken(request);
	}

	public async Task<int> UpdateSyncStatus(int status)
	{
		return await _endpointprovider.UpdateSyncStatus(status);
	}
	public async Task<int> SyncHome(int? limit)
	{
		return await _endpointprovider.SyncHome(limit);
	}
}
