using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData2;
public class HomeDataHandler2 : IQueryHandler<HomeDataQuery2, HomeDataResult2>
{
	private readonly INetatmoService _netatmoservice;
	public HomeDataHandler2(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<HomeDataResult2> Handle(HomeDataQuery2 request, CancellationToken cancellationToken)
	{
		var homeData = await _netatmoservice.GetHomeData(request.HomeId, request.TenantId);
		var homeStatus = await _netatmoservice.GetHomeStatus(request.HomeId, request.TenantId);
		var rooms = new List<Room>();
		foreach (var home in homeData.body.homes)
		{
			foreach (var room in home.rooms)
			{
				var modulListId = new List<string>();
				if (room.module_ids == null) continue;
				foreach (var m in room.module_ids)
				{
					modulListId.Add(m);
				}
				var moduleList = new List<Module>();
				int j = 0;
				for (int i = 0; i < home.modules.Count; i++)
				{
					if (home.modules[i].id == modulListId[j] && home.modules[i].type != "BNMH")
					{
						var module = new Module
						{
							id = home.modules[i].id,
							type = home.modules[i].type,
							name = home.modules[i].name,
							setup_date = home.modules[i].setup_date,
							room_id = home.modules[i].room_id,
							bridge = home.modules[i].bridge,
							on = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).on,
							offload = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).offload,
							firmware_revision = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).firmware_revision,
							last_seen = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).last_seen,
							reachable = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).reachable,
							brightness = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).brightness,
							current_position = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).current_position,
							target_position = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).target_position,
							target_positionstep = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).target_positionstep,
							cooler_status = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).cooler_status,
							fan_speed = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).fan_speed,
							fan_mode = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).fan_mode,
							humidity = homeStatus.body.home.modules.FirstOrDefault(m => m.id == home.modules[i].id).humidity,
						};
						moduleList.Add(module);
						j++;
						if (j == modulListId.Count)
						{
							break;
						}
					}
				}
				if (moduleList.Count != 0)
				{
					var roomIds = homeStatus.body.home.rooms.Select(r => r.id).ToList();
					if (roomIds.Contains(room.id))
					{
						var newRoom = new Room
						{
							id = room.id,
							name = room.name,
							type = room.type,
							module = moduleList,
							therm_measured_temperature = homeStatus.body.home.rooms.FirstOrDefault(r => r.id == room.id).therm_measured_temperature,
							cooling_setpoint_temperature = homeStatus.body.home.rooms.FirstOrDefault(r => r.id == room.id).cooling_setpoint_temperature,
							cooling_setpoint_end_time = homeStatus.body.home.rooms.FirstOrDefault(r => r.id == room.id).cooling_setpoint_end_time,
							cooling_setpoint_mode = homeStatus.body.home.rooms.FirstOrDefault(r => r.id == room.id).cooling_setpoint_mode
						};
						rooms.Add(newRoom);
					}
				}
			}
		}
		var homes = new List<Home>();
		foreach (var h in homeData.body.homes)
		{
			homes.Add(new Home
			{
				id = h.id,
				name = h.name,
				altitude = h.altitude,
				coordinates = h.coordinates,
				country = h.country,
				timezone = h.timezone,
				rooms = rooms,
				temperature_control_mode = h.temperature_control_mode,
				therm_mode = h.therm_mode,
				therm_setpoint_default_duration = h.therm_setpoint_default_duration,
				cooling_mode = h.cooling_mode,
				schedules = h.schedules.Select(s => new Schedule
				{
					timetable = s.timetable,
					zones = s.zones,
					name = s.name,
					@default = s.@default,
					away_temp = s.away_temp,
					hg_temp = s.hg_temp,
					id = s.id,
					type = s.type,
					timetable_sunrise = s.timetable_sunrise,
					timetable_sunset = s.timetable_sunset,
					selected = s.selected
				}).ToList()
			});
		}
		var user = new User()
		{
			email = homeData.body.user.email,
			language = homeData.body.user.language,
			locale = homeData.body.user.locale,
			feel_like_algorithm = homeData.body.user.feel_like_algorithm,
			unit_pressure = homeData.body.user.unit_pressure,
			unit_system = homeData.body.user.unit_system,
			unit_wind = homeData.body.user.unit_wind,
			id = homeData.body.user.id
		};
		var result = new HomeDataResult2
		{
			body = new HomeDataBody
			{
				homes = homes,
				user = user
			},
			status = homeData.status,
			time_exec = homeData.time_exec,
			time_server = homeData.time_server
		};
		return result;
	}
}
