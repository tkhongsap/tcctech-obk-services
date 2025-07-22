using Microsoft.Extensions.Caching.Memory;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Netatmo;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SetState;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SwitchHomeSchedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeData;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeStatus;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.Scenario;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Domain.Netatmo.Entities;
using TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.UpsertUserToken;
using TCCT.ServiceAbstraction.Application.Contracts;
using Microsoft.Extensions.Logging;

namespace TCCT.ServiceAbstraction.Infrastructure.Netatmo;
public class NetatmoEndpointProvider(NetatmoConfig config, INetatmoRepository repo, IMemoryCache cache, IHttpClientFactory httpClientFactory, IRedisService redisService, ILogger<NetatmoEndpointProvider> logger) : INetatmoEndpointProvider
{
	private INetatmoRepository _repo = repo;
	private IMemoryCache _cache = cache;
	private NetatmoConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;
	private IRedisService _redisService = redisService;
	private readonly ILogger<NetatmoEndpointProvider> _logger = logger;
	
	private HttpClient GetClientFromFactory(string? tenantId, string? homeId)
	{
		var client = _httpclientfactory.CreateClient("ignoressl");
		var tenant = "";
		if (tenantId != null) tenant = tenantId;
		var home = "";
		if (homeId != null) home = homeId;
		var token = GetAccessToken(tenant, home).Result;
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
		return client;
	}

	private HttpClient GetClientDefault()
	{
		var client = _httpclientfactory.CreateClient("ignoressl");
		return client;
	}

	private async Task<string> GetAccessToken(string? tenantId, string? homeId)
	{
		string url = _config.EndPoint + $"/oauth2/token";
		string keyCache = $"ntrefreshtoken_{tenantId}_{homeId}";

		var usertokenData = await _redisService.GetCacheAsync(keyCache);
		var usertoken = usertokenData == null ? null : JsonSerializer.Deserialize<user_token>(usertokenData);
		if (usertoken == null)
		{
			usertoken = await _repo.GetUserTokenByTenantIdAndHomeId(tenantId, homeId);
			if (usertoken == null) throw NetatmoException.NTM004;
		}
		
		string keyCacheToken = $"ntrefreshtoken_{usertoken!.utid}";
		var cacheNetatmo = await _redisService.GetCacheAsync(keyCacheToken);
		var cacheData = cacheNetatmo == null ? null : JsonSerializer.Deserialize<NetatmoResponse>(cacheNetatmo);
		if (cacheData == null) // ไม่มีใน cache
		{
			var httpres = await GetClientDefault().PostAsync(url, new FormUrlEncodedContent(new Dictionary<string, string>
				{
					{ "grant_type", "refresh_token" },
					{ "refresh_token", usertoken.refresh_token },
					{ "client_id", usertoken.client_id },
					{ "client_secret", usertoken.client_secret }
				}
			));
			var body = await httpres.Content.ReadAsStringAsync();
			if (!httpres.IsSuccessStatusCode)
			{
				if (body.Contains("invalid_grant")) throw NetatmoException.NTM003; // {\"error\":\"invalid_grant\"}
				if (body.Contains("invalid_client")) throw NetatmoException.NTM007; // {\"error\":\"invalid_client\"}
				throw NetatmoException.NTM006(body);
			}
			cacheData = JsonSerializer.Deserialize<NetatmoResponse>(body)!;
			await _repo.UpdateRefreshToken(usertoken.utid, cacheData.refresh_token);
			await _repo.UpdateSyncStatus(usertoken.utid, 1);
			await _redisService.SetCacheAsync(keyCache, JsonSerializer.Serialize(usertoken), TimeSpan.FromSeconds(3590));
			await _redisService.SetCacheAsync(keyCacheToken, body, TimeSpan.FromSeconds(3600));
		}
		return cacheData!.access_token;
	}
	

	public async Task<HomeDataResult> GetHomeData(string homeId, string? tenantId)
	{
		// var test = GetAccessToken();
		string url = _config.EndPoint + $"/api/homesdata?home_id={homeId}";

		var httpres = await GetClientFromFactory(tenantId, homeId).GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			if (body.Contains("Forbidden access to home")) throw NetatmoException.NTM008; // {"error":{"code":13,"message":"Forbidden access to home"}}
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM001(err.error.message);
		}
		return JsonSerializer.Deserialize<HomeDataResult>(body)!;
	}

	public async Task<HomeStatusResult> GetHomeStatus(string homeId, string? tenantId)
	{
		string url = _config.EndPoint + $"/api/homestatus?home_id={homeId}";

		var httpres = await GetClientFromFactory(tenantId, homeId).GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM001(err.error.message);
		}
		return JsonSerializer.Deserialize<HomeStatusResult>(body)!;
	}

	public async Task<ScenariosResult> GetScenarios(string homeId, string? tenantId)
	{
		string url = _config.EndPoint + $"/api/getscenarios?home_id={homeId}";

		var httpres = await GetClientFromFactory(tenantId, homeId).GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM001(err.error.message);
		}
		return JsonSerializer.Deserialize<ScenariosResult>(body)!;
	}

	public async Task<SwitchHomeScheduleResult> PostSwitchHomeSchedule(string operation, string homeid, string scheduleid, string scheduletype, bool selected, string? tenantId)
	{
		HttpResponseMessage httpres;

		var url = _config.EndPoint + $"/api/switchhomeschedule/?home_id={homeid}&schedule_type={scheduletype}&selected={selected}";
		if (operation == "deactivate" && scheduleid != null) throw NetatmoException.NTM005("deactivate must n't input scheduleid");
		if (operation == "activate") url += $"&schedule_id={scheduleid}";
		if (operation != "activate" && operation != "deactivate") throw NetatmoException.NTM005("operation is wrong or missing");
		httpres = await GetClientFromFactory(tenantId, homeid).PostAsync(url, null);
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM002(err.error.message);
		}
		return JsonSerializer.Deserialize<SwitchHomeScheduleResult>(body)!;
	}

	public async Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, float awayTemp, float hgTemp, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId)
	{
		//TODO: provide heating schedule
		HttpResponseMessage httpres;

		var url = _config.EndPoint + "/api/createnewhomeschedule";

		httpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
		{
			home_id = homeId,
			name = name,
			away_temp = awayTemp,
			hg_temp = hgTemp,
			timetable = timetable,
			zones = zones
		});
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM002(err.error.message);
		}
		return JsonSerializer.Deserialize<CreateNewHomeScheduleResult>(body)!;
	}

	public async Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, string scheduleType, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId)
	{
		//TODO: event heating
		HttpResponseMessage httpres;

		var url = _config.EndPoint + "/api/createnewhomeschedule";

		httpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
		{
			home_id = homeId,
			name = name,
			schedule_type = scheduleType,
			timetable = timetable,
			zones = zones
		});
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM002(err.error.message);
		}
		return JsonSerializer.Deserialize<CreateNewHomeScheduleResult>(body)!;
		throw new NotImplementedException();
	}

	public async Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, float coolingAwayTemp, string scheduleType, bool selected, List<TimeTableType> timetable, List<ZoneType> zones, string? tenantId)
	{
		//TODO: cooling schedule
		HttpResponseMessage httpres;

		var url = _config.EndPoint + "/api/createnewhomeschedule";

		httpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
		{
			home_id = homeId,
			name = name,
			cooling_away_temp = coolingAwayTemp,
			schedule_type = scheduleType,
			selected = selected,
			timetable = timetable,
			zones = zones
		});
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM002(err.error.message);
		}
		return JsonSerializer.Deserialize<CreateNewHomeScheduleResult>(body)!;

	}

	public async Task<CreateNewHomeScheduleResult> CreateNewHomeSchedule(string homeId, string name, string scheduleType, List<TimeTableType> timetable, List<ZoneType> zones, List<TimetableSunType> timeTableSunrise, List<TimetableSunType> timeTableSunset, string? tenantId)
	{
		//TODO: action schedule
		HttpResponseMessage httpres;

		var url = _config.EndPoint + "/api/createnewhomeschedule";

		var mbrightness = zones.Select(zone => zone.modules?.Select(module => new
		{
			module.id,
			module.bridge,
			module.on,
			brightness = module.brightness.HasValue ? (module.brightness <= 100 && module.brightness >= 0 ? module.brightness : throw NetatmoException.NTM005("the brightness value must be between 0 to 100")) : null
		}).ToList()
		).ToList();

		httpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
		{
			home_id = homeId,
			name = name,
			schedule_type = scheduleType,
			timetable = timetable,
			zones = zones,
			timetable_sunrise = timeTableSunrise,
			timetable_sunset = timeTableSunset
		});
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM002(err.error.message);
		}
		return JsonSerializer.Deserialize<CreateNewHomeScheduleResult>(body)!;
	}
	public async Task<SetStateResult> SetState(string id, List<Application.Features.Netatmo.Command.SetState.Room> rooms, string operation, string? tenantId)
	{
		var homeId = id;
		//TODO: set state {manual temp, max temp, frostguard, home mode}
		string url = _config.EndPoint + "/api/setstate";
		string body;
		if (operation == "set manual temp")
		{
			var reqbody = rooms.Select(room => new
			{
				id = room.id,
				therm_setpoint_temperature = room.therm_setpoint_temperature,
				therm_setpoint_mode = room.therm_setpoint_mode
			}).ToList();
			var httpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
			{
				home = new
				{
					id,
					rooms = reqbody
				}
			}
			);
			body = await httpres.Content.ReadAsStringAsync();
			LoggerService.LogRequestAndResponse(_logger, httpres, body);
			if (!httpres.IsSuccessStatusCode)
			{
				var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
				throw NetatmoException.NTM002(err.error.message);
			}
			return JsonSerializer.Deserialize<SetStateResult>(body)!;
		}
		if (operation == "set max temp" || operation == "set frostguard" || operation == "set home mode")
		{
			var reqbody = rooms.Select(room => new { id = room.id, therm_setpoint_end_time = room.therm_setpoint_end_time, therm_setpoint_mode = room.therm_setpoint_mode }).ToList();
			var httpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
			{
				home = new
				{
					id,
					rooms = reqbody
				}
			}
			);
			body = await httpres.Content.ReadAsStringAsync();
			LoggerService.LogRequestAndResponse(_logger, httpres, body);
			if (!httpres.IsSuccessStatusCode)
			{
				var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
				throw NetatmoException.NTM002(err.error.message);
			}
			return JsonSerializer.Deserialize<SetStateResult>(body)!;
		}
		//var httpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, body);
		//throw new NotImplementedException();
		throw NetatmoException.NTM005("Invalid operation");
	}

	public async Task<SetStateResult> SetState(string id, List<Application.Features.Netatmo.Command.SetState.Module> modules, string operation, string? tenantId)
	{
		var homeId = id;
		//TODO: set state {light, launch state, staircase light}
		string url = _config.EndPoint + "/api/setstate";
		switch (operation)
		{
			case "set light":
				var mlight = modules.Select(module => new
				{
					module.id,
					module.bridge,
					module.on
				}).ToList();
				var mlighthttpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
				{
					home = new
					{
						id,
						modules = mlight
					}
				});
				var mlightbody = await mlighthttpres.Content.ReadAsStringAsync();
				if (!mlighthttpres.IsSuccessStatusCode)
				{
					var err = JsonSerializer.Deserialize<NetatmoError>(mlightbody)!;
					throw NetatmoException.NTM002(err.error.message);
				}
				return JsonSerializer.Deserialize<SetStateResult>(mlightbody)!;
			case "set launch state":
				var mlaunch = modules.Select(module => new
				{
					module.id,
					module.scenario
				}).ToList();
				var mlaunchhttpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
				{
					home = new
					{
						id,
						modules = mlaunch
					}
				});
				var mlaunchbody = await mlaunchhttpres.Content.ReadAsStringAsync();
				if (!mlaunchhttpres.IsSuccessStatusCode)
				{
					var err = JsonSerializer.Deserialize<NetatmoError>(mlaunchbody)!;
					throw NetatmoException.NTM002(err.error.message);
				}
				return JsonSerializer.Deserialize<SetStateResult>(mlaunchbody)!;
			case "set staircase light":
				var mstair = modules.Select(module => new
				{
					module.id,
					module.bridge,
					module.on
				}).ToList();
				var mstairhttpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
				{
					home = new
					{
						id,
						modules = mstair
					}
				});
				var mstairbody = await mstairhttpres.Content.ReadAsStringAsync();
				if (!mstairhttpres.IsSuccessStatusCode)
				{
					var err = JsonSerializer.Deserialize<NetatmoError>(mstairbody)!;
					throw NetatmoException.NTM002(err.error.message);
				}
				return JsonSerializer.Deserialize<SetStateResult>(mstairbody)!;
			case "set roller shutter":
				var mroller = modules.Select(module => new
				{
					module.id,
					module.bridge,
					module.target_position
				}).ToList();
				var mrollerhttpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
				{
					home = new
					{
						id,
						modules = mroller
					}
				});
				var mrollerbody = await mrollerhttpres.Content.ReadAsStringAsync();
				if (!mrollerhttpres.IsSuccessStatusCode)
				{
					var err = JsonSerializer.Deserialize<NetatmoError>(mrollerbody)!;
					throw NetatmoException.NTM002(err.error.message);
				}
				return JsonSerializer.Deserialize<SetStateResult>(mrollerbody)!;
			case "set brightness":
				var mbrightness = modules.Select(module => new
				{
					module.id,
					module.bridge,
					module.on,
					brightness = module.brightness.HasValue ? (module.brightness <= 100 && module.brightness >= 0 ? module.brightness : throw NetatmoException.NTM005("the brightness value must be between 0 to 100")) : null
				}).ToList();
				var mbrightnesshttpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
				{
					home = new
					{
						id,
						modules = mbrightness
					}
				});
				var mbrightnessbody = await mbrightnesshttpres.Content.ReadAsStringAsync();
				if (!mbrightnesshttpres.IsSuccessStatusCode)
				{
					var err = JsonSerializer.Deserialize<NetatmoError>(mbrightnessbody)!;
					throw NetatmoException.NTM002(err.error.message);
				}
				return JsonSerializer.Deserialize<SetStateResult>(mbrightnessbody)!;
			case "set air fan":
				var mfan = modules.Select(module => new
				{
					module.id,
					module.bridge,
					module.fan_speed
				}).ToList();
				var mfanhttpres = await GetClientFromFactory(tenantId, homeId).PostAsJsonAsync(url, new
				{
					home = new
					{
						id,
						modules = mfan
					}
				});
				var mfanbody = await mfanhttpres.Content.ReadAsStringAsync();
				if (!mfanhttpres.IsSuccessStatusCode)
				{
					var err = JsonSerializer.Deserialize<NetatmoError>(mfanbody)!;
					throw NetatmoException.NTM002(err.error.message);
				}
				return JsonSerializer.Deserialize<SetStateResult>(mfanbody)!;
		}
		throw NetatmoException.NTM005("Invalid operation");
	}

	public async Task<SynchomeScheduleResult> SetSynchomeschedule(string home_id, string schedule_id, string name, string schedule_type, float? cooling_away_temp,List<TimetableSunType>? timetable_sunrise,List<TimetableSunType>? timetable_sunset, List<Application.Features.Netatmo.Command.Synchomeschedule.Timetable> timetable, List<Application.Features.Netatmo.Command.Synchomeschedule.Zone> zones, string? tenantId)
	{
		var url = _config.EndPoint + "/api/synchomeschedule";
		if (schedule_type != "event" && schedule_type != "cooling")
		{
			throw NetatmoException.NTM005("Invalid schedule_type");
		}
		var httpres = await GetClientFromFactory(tenantId, home_id).PostAsJsonAsync(url, new
		{
			home_id,
			schedule_id,
			name,
			schedule_type,
			cooling_away_temp,
			zones,
			timetable,
			timetable_sunrise,
			timetable_sunset
			
			
		});
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode)
		{
			var err = JsonSerializer.Deserialize<NetatmoError>(body)!;
			throw NetatmoException.NTM002(err.error.message);
		}
		return JsonSerializer.Deserialize<SynchomeScheduleResult>(body)!;
		throw new NotImplementedException();
	}

	public async Task<List<user_token_mapping>> GetUserTokenList(string? tenantId, string? homeId)
	{
		return await _repo.GetListUserToken(tenantId, homeId);
	}

	public async Task<(int Inserted, int Updated)> UpsertUserToken(UpsertUserTokenData request)
	{
		Guid idToken = Guid.NewGuid();
		var result = await _repo.GetUserToken(request.ClientId, request.ClientSecret);
		if (result == null) {
			idToken = await _repo.CreateUserToken(request.User, request.ClientId, request.ClientSecret, request.Refreshtoken);
		} else {
			idToken = result.utid;
		}

		int countInsert = 0;
		int countUpdate = 0;
		var mapping = await _repo.GetUserTokenMapping(request.TenantId, request.HomeId, idToken);
		if (mapping == null) {
			var response = await _repo.CreateUserTokenMapping(idToken, request.TenantId, request.HomeId);
			countInsert++;
		} else if (mapping.utid != idToken) {
			var response = await _repo.UpdateUserTokenMapping(idToken, mapping.utid, request.TenantId, request.HomeId);
			countUpdate++;
		}
		
		return (countInsert, countUpdate);
	}
	public async Task<int> UpdateSyncStatus(int status)
	{
		return await _repo.UpdateSyncStatus(null, status, 2);
	}

	public async Task<int> SyncHome(int? limit)
	{
		var getDataSync = await _repo.GetListUserTokenMappingBySynsStatus(0, limit);
		if (getDataSync.Count == 0) return 0;
		var dicData = new Dictionary<String, bool> {};
		foreach (var data in getDataSync) {
			var keyCheck = $"{data.utid}";
			if (dicData.ContainsKey(keyCheck)) continue;
			dicData.Add(keyCheck, true);
			await _repo.UpdateSyncStatus(data.utid, 1);
			try {
				await GetAccessToken(data.tenant_id, data.home_id);
			} catch (Exception ex)
			{	
				await _repo.UpdateSyncStatus(data.utid, 2);
				//throw NetatmoException.NTM011(ex.Message);
			}
		}
		return getDataSync.Count;
	}
}