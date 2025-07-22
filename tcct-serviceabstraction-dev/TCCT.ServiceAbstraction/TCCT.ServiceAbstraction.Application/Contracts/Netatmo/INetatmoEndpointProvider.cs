using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpsertUserToken;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SetState;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SwitchHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeStatus;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.Scenario;
using TCCT.ServiceAbstraction.Domain.Netatmo.Entities;

namespace TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
public interface INetatmoEndpointProvider
{
	Task<HomeDataResult> GetHomeData(string homeId, string? tenantId);
	Task<HomeStatusResult> GetHomeStatus(string homeId, string? tenantId);
	Task<ScenariosResult> GetScenarios(string homeId, string? tenantId);

	/// <summary>
	/// Create <b>Heating </b>Schedule
	/// </summary>
	Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, float awayTemp, float hgTemp, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId);
	/// <summary>
	/// Create <b>Heating Event</b> Schedule
	/// </summary>
	Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, string scheduleType, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId);
	/// <summary>
	/// Create <b>Cooling</b> Schedule
	/// </summary>
	Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, float coolingAwayTemp, string scheduleType, bool selected, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId);
	/// <summary>
	/// Create <b>Action</b> Schedule
	/// </summary>
	Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, string scheduleType, List<TimeTableType> timetable, List<ZoneType> zones, List<TimetableSunType> timeTableSunrise, List<TimetableSunType> timeTableSunset, string? tenantId);
	Task<SwitchHomeScheduleResult> PostSwitchHomeSchedule(string operation, string homeid, string scheduleid, string scheduletype, bool selected, string? tenantId);

	Task<SetStateResult> SetState(string id, List<Features.Netatmo.Command.SetState.Room> rooms, string operation, string? tenantId);
	Task<SetStateResult> SetState(string id, List<Features.Netatmo.Command.SetState.Module> modules, string operation, string? tenantId);
	Task<SynchomeScheduleResult> SetSynchomeschedule(string home_id, string schedule_id, string name, string schedule_type, float? cooling_away_temp,List<TimetableSunType>? timetable_sunrise,List<TimetableSunType>? timetable_sunset, List<Application.Features.Netatmo.Command.Synchomeschedule.Timetable> timetable, List<Application.Features.Netatmo.Command.Synchomeschedule.Zone> zones, string? tenantId);
	Task<List<user_token_mapping>> GetUserTokenList(string? tenantId, string? homeId);
	Task<(int Inserted, int Updated)> UpsertUserToken(UpsertUserTokenData request);
	Task<int> UpdateSyncStatus(int status);
	Task<int> SyncHome(int? limit);
}
