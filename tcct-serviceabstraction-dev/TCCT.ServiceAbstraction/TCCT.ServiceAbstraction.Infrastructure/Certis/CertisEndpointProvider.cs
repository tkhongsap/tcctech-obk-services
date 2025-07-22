using Microsoft.AspNetCore.Http;
using System.Net.Http.Json;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetGroup;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWODefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOStatusCode;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOType;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists.CheckListTasks;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CommentTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors.FMSupervisorServices;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMTechnicians;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMTechnicians.FMTechnicianServices;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Priorities;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ProblemTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Requesters;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.RequesterTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceCategories.ServingLocations;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceProviders;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.Locations;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.AttachmentTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.DefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.FrequencyTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.StatusCodes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Assets;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseAssetCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseLocations;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseLocationTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseMedia;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.Cases;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseStatus;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseTasks;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseTaskByTaskId;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventSubTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.EventTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Icons;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Media.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Priorities;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.SiteHandlers;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.SlaConfigs;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.TaskCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.TaskStatuses;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CommentById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Master;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Pause;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Resume;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupportiveTeam;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Task;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Transactions;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOffline;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOnline;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyHidden;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeHidden;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.CheckListMaps;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMMasterWorkOrder;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ServicingObject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Technicians;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CasesUpdates;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.Users;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.CreateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffByBuilding;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.AddStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Models.Auth;
using TCCT.ServiceAbstraction.Application.Contracts;
using System.Net.Http.Headers;
using System.Net;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetFunctionRoles;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.DeleteStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.UpdateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffSearch;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWOUpdate;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CreateCWOExternal;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMUpdate;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CreateCWOWithCaseLink;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.IFM.CWOsbyincidentId;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.UpdateCaseStatus;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis;

public partial class CertisEndpointProvider(CertisConfig config, IHttpClientFactory httpClientFactory, IRedisService redisService, ILogger<CertisEndpointProvider> logger) : CertisServiceBase, ICertisEndpointProvider
{
	private CertisConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;	
	private IRedisService _redisService = redisService;
	private readonly ILogger<CertisEndpointProvider> _logger = logger;
	
	private HttpClient GetClientFromFactory()
	{
		var client = _httpclientfactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Add("x-api-key", _config.APIKey);
		return client;
	}

	private async Task<AuthResult> GetClientCredential()
	{
		var endpoint = _config.MainEndPoint + "/auth/realms/mozart/protocol/openid-connect/token";

		string keyCacheToken = $"certistoken_{_config.ClientID}";
		var cacheAuthCertis = await _redisService.GetCacheAsync(keyCacheToken);
		var cacheData = cacheAuthCertis == null ? null : JsonSerializer.Deserialize<AuthResult>(cacheAuthCertis);
		AuthResult? res = null;
		if (cacheData == null) // ไม่มีใน cache
		{
			var content = new FormUrlEncodedContent(new[]
			{
				new KeyValuePair<string, string>("grant_type", "client_credentials"),
				new KeyValuePair<string, string>("client_id", _config.ClientID),
				new KeyValuePair<string, string>("client_secret", _config.ClientSecret),
			});

			var httpres = await GetClientFromFactory().PostAsync(endpoint, content);
			var resbody = await httpres.Content.ReadAsStringAsync();
			LoggerService.LogRequestAndResponse(_logger, httpres, "");	
			if (httpres.StatusCode == HttpStatusCode.BadRequest) throw CertisServiceException.CT002(resbody);
			if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CT001(resbody);
			res = JsonSerializer.Deserialize<AuthResult>(resbody)!;
			await _redisService.SetCacheAsync(keyCacheToken, resbody, TimeSpan.FromSeconds(3600));
		} else {
			res = cacheData;
		}
		return res!;
	}

	public async Task<HttpClient> GetClientFromFactoryWithBearer()
	{
		var login = await GetClientCredential();
		var client = _httpclientfactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.access_token);
		client.DefaultRequestHeaders.Add("Tenant", _config.TenantHeaders);
		return client;
	}

	string GetRequestThirdPartyJson(HttpResponseMessage httpres, string body)
	{
		LoggerService.LogRequestAndResponse(_logger, httpres, "");
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		return $"request:{requestThirdParty}, response:{body}";
	}
	// Master data
	#region Asset
	public async Task<List<AssetCategoriesResult>> GetAssetCategories()
	{
		string url = _config.EndPoint + "/master/assetcategories";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<AssetCategoriesResult>>(body)!;
	}

	public async Task<List<AssetGroupResult>> GetAssetGroups()
	{
		string url = _config.EndPoint + "/master/assetgroups";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<AssetGroupResult>>(body)!;
	}

	public async Task<List<AssetResult>> GetAssets()
	{
		string url = _config.EndPoint + "/master/assets";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<AssetResult>>(body)!;
	}
	#endregion

	#region Location
	public async Task<List<LocationTypeResult>> GetLocationTypes()
	{
		string url = _config.EndPoint + "/master/locationtypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<LocationTypeResult>>(body)!;
	}

	public async Task<List<LocationsResult>> GetLocations()
	{
		string url = _config.EndPoint + "/master/locations";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<LocationsResult>>(body)!;
	}

	public async Task<LocationConfigResult> GetLocationConfig()
	{
		string url = _config.EndPoint + "/master/locationdefaultconfig";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<LocationConfigResult>(body)!;
	}
	#endregion

	#region FM Related
	public async Task<List<PriorityResult>> GetPriorities()
	{
		string url = _config.EndPoint + "/master/priorities";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<PriorityResult>>(body)!;
	}

	public async Task<List<RequesterTypeResult>> GetRequesterTypes()
	{
		string url = _config.EndPoint + "/master/requestertypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<RequesterTypeResult>>(body)!;
	}

	public async Task<List<RequesterResult>> GetRequesters()
	{
		string url = _config.EndPoint + "/master/requesters";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<RequesterResult>>(body)!;
	}

	public async Task<List<CommentTypeResult>> GetCommentTypes()
	{
		string url = _config.EndPoint + "/master/commenttypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CommentTypeResult>>(body)!;
	}

	public async Task<List<ServiceProviderResult>> GetServiceProviders()
	{
		string url = _config.EndPoint + "/master/serviceproviders";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<ServiceProviderResult>>(body)!;
	}

	public async Task<List<ServiceCategoryResult>> GetServiceCategories()
	{
		string url = _config.EndPoint + "/master/servicecategories";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<ServiceCategoryResult>>(body)!;
	}

	public async Task<List<ServingLocationResult>> GetServingLocations()
	{
		string url = _config.EndPoint + "/master/servicecategoryservinglocations";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<ServingLocationResult>>(body)!;
	}

	public async Task<List<ProblemTypeResult>> GetProblemTypes()
	{
		string url = _config.EndPoint + "/master/problemtypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<ProblemTypeResult>>(body)!;
	}

	public async Task<List<CheckListResult>> GetCheckLists()
	{
		string url = _config.EndPoint + "/master/checklists";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CheckListResult>>(body)!;
	}

	public async Task<List<CheckListTaskResult>> GetCheckListTasks()
	{
		string url = _config.EndPoint + "/master/checklisttasks";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CheckListTaskResult>>(body)!;
	}

	public async Task<List<FMSupervisorResult>> GetFMSupervisors()
	{
		string url = _config.EndPoint + "/master/fmsupervisors";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<FMSupervisorResult>>(body)!;
	}

	public async Task<List<FMSupervisorServiceResult>> GetFMSupervisorServices()
	{
		string url = _config.EndPoint + "/master/fmsupervisorservices";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<FMSupervisorServiceResult>>(body)!;
	}

	public async Task<List<FMTechnicianResult>> GetFMTechnicians()
	{
		string url = _config.EndPoint + "/master/fmtechnicians";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<FMTechnicianResult>>(body)!;
	}

	public async Task<List<FMTechnicianServiceResult>> GetFMTechnicianServices()
	{
		string url = _config.EndPoint + "/master/fmtechnicianservices";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<FMTechnicianServiceResult>>(body)!;
	}

	#endregion

	#region CWO - Corrective Work Orders
	public async Task<List<CWOTypeResult>> GetCwoTypes()
	{
		string url = _config.EndPoint + "/master/cwotypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CWOTypeResult>>(body)!;
	}

	public async Task<List<CWOStatusCodeResult>> GetCwoStatusCodes()
	{
		string url = _config.EndPoint + "/master/cwostatuscodes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CWOStatusCodeResult>>(body)!;
	}

	public async Task<CWODefaultConfigResult> GetCwoDefaultConfig()
	{
		string url = _config.EndPoint + "/master/cwodefaultconfig";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<CWODefaultConfigResult>(body)!;
	}

	#endregion

	#region PPM - Plan and Preventive Maintainance
	public async Task<List<FrequencyTypeResult>> GetFrequencyTypes()
	{
		string url = _config.EndPoint + "/master/ppmfrequencytypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<FrequencyTypeResult>>(body)!;
	}

	public async Task<List<StatusCodesResult>> GetStatusCodes()
	{
		string url = _config.EndPoint + "/master/ppmstatuscodes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<StatusCodesResult>>(body)!;
	}

	public async Task<PPMDefaultConfigResult> GetDefaultConfig()
	{
		string url = _config.EndPoint + "/master/ppmdefaultconfig";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<PPMDefaultConfigResult>(body)!;
	}

	#endregion

	#region Others
	// Attachment
	public async Task<List<AttachmentTypeResult>> GetAttachmentTypes()
	{
		string url = _config.EndPoint + "/master/attachmenttypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<AttachmentTypeResult>>(body)!;
	}


	public async Task<List<UsersResult>> GetUsers()
	{
		string url = _config.EndPoint + "/master/users";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<UsersResult>>(body)!;
	}
	#endregion

	//CWO
	#region CWO
	public async Task<Application.Features.Certis.Transaction.CWO.AcknowledgeAssignment.AcknowledgeAssignmentResult> CWOAcknowledgeAssignment(int cwoId, Guid ackedBy, string ackVerifiedBy, string acknowledgementSignature, string supportiveTechnicianIds, bool isWorkingOffline, string workOfflineReason, int locationId, string description, int requesterId, int assetId)
	{
		string url = _config.EndPoint + "/cwo/acknowledgeassignment";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			AckedBy = ackedBy,
			AckVerifiedBy = ackVerifiedBy,
			AcknowledgementSignature = acknowledgementSignature,
			SupportiveTechnicianIds = supportiveTechnicianIds,
			IsWorkingOffline = isWorkingOffline,
			WorkOfflineReason = workOfflineReason,
			LocationId = locationId,
			Description = description,
			RequesterId = requesterId,
			AssetId = assetId,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.AcknowledgeAssignment.AcknowledgeAssignmentResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.CWO.AssignSupervisor.AssignSupervisorResult> CWOAssignSupervisor(int cwoId, Guid supervisorId, Guid assignedBy, int locationId, string description, int requesterId, int asset)
	{
		string url = _config.EndPoint + "/cwo/assignsupervisor";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			SupervisorId = supervisorId,
			AssignedBy = assignedBy,
			LocationId = locationId,
			Description = description,
			RequesterId = requesterId,
			AssetId = asset
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.AssignSupervisor.AssignSupervisorResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.CWO.AssignTechnician.AssignTechnicianResult> CWOAssignTechnician(int cwoId, Guid assignedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int asset)
	{
		string url = _config.EndPoint + "/cwo/assigntechnician";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			AssignedBy = assignedBy,
			TechnicianId = technicianId,
			OperatorNote = operatorNote,
			LocationId = locationId,
			Description = description,
			RequesterId = requesterId,
			AssetId = asset
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.AssignTechnician.AssignTechnicianResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.CWO.ClientVerify.ClientVerifyResult> CWOClientVerify(int cwoId, string clientVerificationComment, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy)
	{
		string url = _config.EndPoint + "/cwo/clientverify";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			ClientVerificationComment = clientVerificationComment,
			ClientVerifiedBy = clientVerifiedBy,
			ClientVerificationSignature = clientVerificationSignature,
			ClientVerificationSubmittedBy = clientVerificationSubmittedBy,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.ClientVerify.ClientVerifyResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.CWO.Close.CloseResult> CWOClose(int cwoId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy)
	{
		string url = _config.EndPoint + "/cwo/close";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			ClosureComment = closureComment,
			CompletionVerifiedBy = completionVerifiedBy,
			ClosureSignature = closureSignature,
			ClosedBy = closedBy,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.Close.CloseResult>(body)!;

	}

	public async Task<CreateCWOExternalResult> CWOExternal(CreateCWOExternalCommand data)
	{
		string url = _config.ExternalEndPoint + "/cwo/" + _config.ExternalClient + "/createcwo";
		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, data);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<CreateCWOExternalResult>(body)!;
	}


	public async Task<Application.Features.Certis.Transaction.CWO.Comment.Command.CommentResult> CWOComment(int cwoId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy)
	{
		string url = _config.EndPoint + "/cwo/comment";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			CommentTypeId = commentTypeId,
			Comment = comment,
			CommentedOn = commentedOn,
			CommentedBy = commentedBy,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.Comment.Command.CommentResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.CWO.Complete.CompleteResult> CWOComplete(int cwoId, string completionComment, string completionAckedBy, string completionSignature, Guid completedBy, int locationId, string description, int requesterId, int? assetId)
	{
		string url = _config.EndPoint + "/cwo/complete";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			CompletionComment = completionComment,
			CompletionAckedBy = completionAckedBy,
			CompletionSignature = completionSignature,
			CompletedBy = completedBy,
			LocationId = locationId,
			Description = description,
			RequesterId = requesterId,
			AssetId = assetId,
			RootCauseId = 4 //change this when ui ready
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.Complete.CompleteResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion.ConfirmTaskCompletionResult> CWOConfirmTaskCompletion(int cwoId, Guid confirmedBy)
	{
		string url = _config.EndPoint + "/cwo/confirmtaskcompletion";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			ConfirmedBy = confirmedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion.ConfirmTaskCompletionResult>(body)!;

	}

	public async Task<CWOResult> CWO(DateTime requestedOn, int requesterId, int cwoTypeId, int problemTypeId, int priorityId, int serviceCategoryId, int locationId, Guid createdBy, string description, int assetId)
	{
		string url = _config.EndPoint + "/cwo/cwo";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			RequestedOn = requestedOn,
			RequesterId = requesterId,
			CwoTypeId = cwoTypeId,
			ProblemTypeId = problemTypeId,
			PriorityId = priorityId,
			ServiceCategoryId = serviceCategoryId,
			LocationId = locationId,
			CreatedBy = createdBy,
			Description = description,
			AssetId = assetId
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<CWOResult>(body)!;

	}

	public async Task<PauseResult> CWOPause(int cwoId, Guid pausedBy, string reason)
	{
		string url = _config.EndPoint + "/cwo/pause";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			PausedBy = pausedBy,
			Reason = reason
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<PauseResult>(body)!;

	}

	public async Task<ResumeResult> CWOResume(int cwoId, Guid resumedBy)
	{
		string url = _config.EndPoint + "/cwo/resume";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			ResumedBy = resumedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<ResumeResult>(body)!;
	}

	public async Task<Application.Features.Certis.Transaction.CWO.Rework.ReworkResult> CWORework(int cwoId, string reasonToRework, Guid reworkRequestedBy)
	{
		string url = _config.EndPoint + "/cwo/rework";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			ReasonToRework = reasonToRework,
			ReworkRequestedBy = reworkRequestedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.Rework.ReworkResult>(body)!;
	}

	public async Task<Application.Features.Certis.Transaction.CWO.SupervisorReject.SupervisorRejectResult> CWOSupervisorReject(int cwoId, Guid rejectedBy, int locationId, string description, int requesterId, int assetId)
	{
		string url = _config.EndPoint + "/cwo/supervisorreject";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			RejectedBy = rejectedBy,
			LocationId = locationId,
			Description = description,
			RequesterId = requesterId,
			AssetId = assetId,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.SupervisorReject.SupervisorRejectResult>(body)!;
	}

	public async Task<Application.Features.Certis.Transaction.CWO.TechnicianReject.TechnicianRejectResult> CWOTechnicianReject
		(int cwoId, Guid rejectedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int assetId)
	{
		string url = _config.EndPoint + "/cwo/technicianreject";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			RejectedBy = rejectedBy,
			TechnicianId = technicianId,
			OperatorNote = operatorNote,
			LocationId = locationId,
			Description = description,
			RequesterId = requesterId,
			AssetId = assetId,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.TechnicianReject.TechnicianRejectResult>(body)!;
	}

	public async Task<Application.Features.Certis.Transaction.CWO.UpdateTask.UpdateTaskResult> CWOUpdateTask(int id, string taskStatus, string remark, string reading, Guid updatedBy, DateTime updatedOn)
	{
		string url = _config.EndPoint + "/cwo/updatetask";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			Id = id,
			TaskStatus = taskStatus,
			Remarks = remark,
			Reading = reading,
			UpdatedBy = updatedBy,
			UpdatedOn = updatedOn
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.CWO.UpdateTask.UpdateTaskResult>(body)!;
	}

	public async Task<WorkOfflineResult> CWOWorkOffline(int cwoId, Guid workOfflineBy, string reason)
	{
		string url = _config.EndPoint + "/cwo/workoffline";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			WorkOfflineBy = workOfflineBy,
			Reason = reason,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<WorkOfflineResult>(body)!;
	}

	public async Task<WorkOnlineResult> CWOWorkOnline(int cwoId, Guid reactivatedBy)
	{
		string url = _config.EndPoint + "/cwo/workonline";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoId = cwoId,
			ReactivatedBy = reactivatedBy,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<WorkOnlineResult>(body)!;
	}

	public async Task<List<TaskResult>> CWOTask(string cwoIdsCsv)
	{
		string url = _config.EndPoint + "/cwo/tasks";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoIdsCsv = cwoIdsCsv,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<TaskResult>>(body)!;
	}

	public async Task<List<CWOMasterResult>> CWOMaster()
	{
		string url = _config.EndPoint + "/cwo/cwos";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CWOMasterResult>>(body)!;
	}

	public async Task<List<CWOUpdateResult>> CWOUpdate(string? fromDate, string? toDate, string? countData, string? skipData)
	{
		string url = _config.EndPoint + "/cwo/cwoupdates?";

		if (fromDate != null)
		{
			url += "&from=" + fromDate;
		}

		if (toDate != null) 
		{
			url += "&to=" + toDate;
		}

		if (countData != null)
		{
			url += "&count=" + countData;
		}

		if (skipData != null)
		{
			url += "&skip=" + skipData;
		}

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CWOUpdateResult>>(body)!;
	}


	public async Task<List<SupportiveTeamResult>> CWOSupportiveTeam(string id)
	{
		string url = _config.EndPoint + "/cwo/supportiveteam/" + id;

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<SupportiveTeamResult>>(body)!;
	}

	public async Task<List<Application.Features.Certis.Transaction.CWO.Comment.Query.CommentResult>> GetComments(string cwoIdsCsv)
	{
		string url = _config.EndPoint + "/cwo/comments";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			CwoIdsCsv = cwoIdsCsv,
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<Application.Features.Certis.Transaction.CWO.Comment.Query.CommentResult>>(body)!;
	}

	public async Task<List<TransactionsResult>> CWOTransactions(string id)
	{
		string url = _config.EndPoint + "/cwo/transactions/" + id;

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<TransactionsResult>>(body)!;
	}
	public async Task<List<CommentByIdResult>> CWOCommentById(string id)
	{
		string url = _config.EndPoint + "/cwo/transactions/" + id;

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CommentByIdResult>>(body)!;
	}
	public async Task<List<DocumentsRelatedByIdResult>> CWODocumentsRelatedById(string id)
	{
		string url = _config.EndPoint + "/cwo/documents/" + id + "/related";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<DocumentsRelatedByIdResult>>(body)!;
	}

	public async Task<List<CWOsbyincidentIdResult>> CWOsbyincidentId(int id)
	{
		string url = _config.IFM + "/cwo/cwosbyincidentId/" + id;

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CWOsbyincidentIdResult>>(body)!;
	}

	#endregion

	#region PPM
	public async Task<PPMWOResult> PPMWO(int mwoId, int checklistMapId)
	{
		string url = _config.EndPoint + "/ppm/ppmwo";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			MwoId = mwoId,
			ChecklistMapId = checklistMapId
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<PPMWOResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.AcknowledgeAssignment.AcknowledgeAssignmentResult> PPMAcknowledgeAssignment(int woId, Guid ackedBy, string acknowledgementSignature)
	{
		string url = _config.EndPoint + "/ppm/acknowledgeassignment";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			AckedBy = ackedBy,
			AcknowledgementSignature = acknowledgementSignature
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.AcknowledgeAssignment.AcknowledgeAssignmentResult>(body)!;
	}

	public async Task<Application.Features.Certis.Transaction.PPM.AssignSupervisor.AssignSupervisorResult> PPMAssignSupervisor(int woId, Guid supervisorId, Guid assignedBy)
	{
		string url = _config.EndPoint + "/ppm/assignsupervisor";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			SupervisorId = supervisorId,
			AssignedBy = assignedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.AssignSupervisor.AssignSupervisorResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.AssignTechnician.AssignTechnicianResult> PPMAssignTechnician(int woId, string technicianIds, Guid assignedBy)
	{
		string url = _config.EndPoint + "/ppm/assigntechnician";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			TechnicianIds = technicianIds,
			AssignedBy = assignedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.AssignTechnician.AssignTechnicianResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.ClientVerify.ClientVerifyResult> PPMClientVerify(int woId, string clientVerificationComment, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy)
	{
		string url = _config.EndPoint + "/ppm/clientverify";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			ClientVerificationComment = clientVerificationComment,
			ClientVerifiedBy = clientVerifiedBy,
			ClientVerificationSignature = clientVerificationSignature,
			ClientVerificationSubmittedBy = clientVerificationSubmittedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.ClientVerify.ClientVerifyResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.Close.CloseResult> PPMCloseResult(int woId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy)
	{
		string url = _config.EndPoint + "/ppm/close";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			ClosureComment = closureComment,
			CompletionVerifiedBy = completionVerifiedBy,
			ClosureSignature = closureSignature,
			ClosedBy = closedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.Close.CloseResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.Comment.Command.CommentResult> PPMComment(int woId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy)
	{
		string url = _config.EndPoint + "/ppm/comment";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			CommentTypeId = commentTypeId,
			Comment = comment,
			CommentedOn = commentedOn,
			CommentedBy = commentedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.Comment.Command.CommentResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.Complete.CompleteResult> PPMComplete(int woId, string completionComment, string completionSignature, Guid completedBy)
	{
		string url = _config.EndPoint + "/ppm/complete";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			CompletionComment = completionComment,
			CompletionSignature = completionSignature,
			CompletedBy = completedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.Complete.CompleteResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.ConfirmTaskCompletion.ConfirmTaskCompletionResult> PPMConfirmTaskCompletion(int objectId, Guid confirmedBy)
	{
		string url = _config.EndPoint + "/ppm/confirmtaskcompletion";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			ObjectId = objectId,
			ConfirmedBy = confirmedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.ConfirmTaskCompletion.ConfirmTaskCompletionResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.Rework.ReworkResult> PPMRework(int woId, string reasonToRework, Guid reworkRequestedBy)
	{
		string url = _config.EndPoint + "/ppm/rework";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			ReasonToRework = reasonToRework,
			ReworkRequestedBy = reworkRequestedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.Rework.ReworkResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.SupervisorReject.SupervisorRejectResult> PPMSupervisorReject(int woId, Guid rejectedBy)
	{
		string url = _config.EndPoint + "/ppm/supervisorreject";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			RejectedBy = rejectedBy
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.SupervisorReject.SupervisorRejectResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.TechnicianReject.TechnicianRejectResult> PPMTechnicianReject(int woId, Guid rejectedBy, Guid technicianId)
	{
		string url = _config.EndPoint + "/ppm/technicianreject";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoId = woId,
			RejectedBy = rejectedBy,
			TechnicianId = technicianId
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.TechnicianReject.TechnicianRejectResult>(body)!;

	}

	public async Task<Application.Features.Certis.Transaction.PPM.UpdateTask.UpdateTaskResult> PPMUpdateTask(int id, string taskStatus, string remarks, string reading, Guid updatedBy, DateTime updatedOn, string documentId)
	{
		string url = _config.EndPoint + "/ppm/updatetask";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			Id = id,
			TaskStatus = taskStatus,
			DocumentId = documentId,
			Remarks = remarks,
			Reading = reading,
			UpdatedBy = updatedBy,
			UpdatedOn = updatedOn
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<Application.Features.Certis.Transaction.PPM.UpdateTask.UpdateTaskResult>(body)!;

	}

	public async Task<List<PPMMasterResult>> PPMMaster()
	{
		string url = _config.EndPoint + "/ppm/ppmwos";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<PPMMasterResult>>(body)!;
	}

	public async Task<List<PPMMasterWorkOrderResult>> PPMMasterWorkOrder()
	{
		string url = _config.EndPoint + "/ppm/mwos";
		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<PPMMasterWorkOrderResult>>(body)!;
	}

	public async Task<List<CheckListMapsResult>> PPMCheckListMap()
	{
		string url = _config.EndPoint + "/ppm/checklistmaps";
		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CheckListMapsResult>>(body)!;
	}

	public async Task<List<TechniciansResult>> PPMTechnicians(string id)
	{
		string url = _config.EndPoint + "/ppm/technicians";
		var client = GetClientFromFactory();
		var getjson = "{ \"WoidsCsv\":\"" + id + "\" }";

		var request = new HttpRequestMessage
		{
			Method = HttpMethod.Get,
			RequestUri = new Uri(url),
			Content = new StringContent(getjson, Encoding.UTF8, MediaTypeNames.Application.Json)
		};

		var httpres = await client.SendAsync(request);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<TechniciansResult>>(body)!;
	}
	public async Task<List<CommentsResult>> PPMComments(string woid)
	{
		string url = _config.EndPoint + "/ppm/comments/" + woid;

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CommentsResult>>(body)!;
	}

	public async Task<List<Application.Features.Certis.Transaction.PPM.Transactions.TransactionsResult>> PPMTransactions(string woid)
	{
		string url = _config.EndPoint + "/ppm/transactions/" + woid;
		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<Application.Features.Certis.Transaction.PPM.Transactions.TransactionsResult>>(body)!;
	}

	public async Task<List<PPMDocumentsRelatedByIdResult>> PPMDocumentsRelatedById(string id)
	{
		string url = _config.EndPoint + "/ppm/documents/" + id + "/related";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<PPMDocumentsRelatedByIdResult>>(body)!;
	}

	public async Task<List<Application.Features.Certis.Transaction.PPM.Task.TaskResult>> GetTask(string workOrderId)
	{
		string url = _config.EndPoint + "/ppm/servicingobjects/tasks";
		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoIdsCsv = workOrderId
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<Application.Features.Certis.Transaction.PPM.Task.TaskResult>>(body)!;
	}

	public async Task<List<ServicingObjectResult>> GetServicingObject(string workOrderId)
	{
		string url = _config.EndPoint + "/ppm/servicingobjects";
		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			WoIdsCsv = workOrderId
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<ServicingObjectResult>>(body)!;
	}

	public async Task<List<PPMUpdateResult>> PPMUpdate(string? fromDate, string? toDate, string? countData, string? skipData)
	{
		string url = _config.EndPoint + "/ppm/ppmupdates?";

		if (fromDate != null)
		{
			url += "&from=" + fromDate;
		}

		if (toDate != null) 
		{
			url += "&to=" + toDate;
		}

		if (countData != null)
		{
			url += "&count=" + countData;
		}

		if (skipData != null)
		{
			url += "&skip=" + skipData;
		}

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<PPMUpdateResult>>(body)!;
	}

	#endregion

	//DMS
	#region DMS - Document Management System
	public async Task<DocumentManagementResult> UploadDMS(int objectKey, string objectType, string description, string searchTags, string attachmentType, string isDefault, string isHidden, IFormFile image)
	{
		string url = _config.DMS + $"/documents/upload?objectKey={objectKey}&objectType={objectType}&description={description}&searchTags={searchTags}&attachmentType={attachmentType}&isDefault=0&isHidden=1";
		string body = "";
		using (var form = new MultipartFormDataContent())
		{
			using (var streamContent = new StreamContent(image.OpenReadStream()))
			{
				using (var fileContent = new ByteArrayContent(await streamContent.ReadAsByteArrayAsync()))
				{
					string con = image.ContentType;
					fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(con); // jpeg, png, pdf

					form.Add(fileContent, "file", image.FileName);
					HttpResponseMessage response = await GetClientFromFactory().PostAsync(url, form);
					body = await response.Content.ReadAsStringAsync();
				}
			}
		}

		//string url = _config.EndPoint + "/dms/documents/upload" + $"?objectKey={objectKey}&objectType={objectType}&description={description}&searchTags={searchTags}&attachmentType={attachmentType}&isDefault={isDefault}&isHidden={isHidden}";

		//string body = "";
		//using (var ms = new MemoryStream())
		//{
		//	image.CopyTo(ms);
		//	using (var content =
		//				 new MultipartFormDataContent("Upload----" + DateTime.Now.ToString(CultureInfo.InvariantCulture)))
		//	{
		//		content.Add(new StreamContent(ms), "file", image.FileName);

		//		using (var httpres = await GetClientFromFactory().PostAsync(url, content))
		//		{
		//			if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002();
		//			body = await httpres.Content.ReadAsStringAsync();
		//		}
		//	}
		//}

		return JsonSerializer.Deserialize<DocumentManagementResult>(body)!;

	}

	public async Task<DmsImageByIdResult> GetDmsImageByIdResult(int id)
	{
		string url = _config.EndPoint + $"/dms/documents/{id}";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsByteArrayAsync();
		var reason = httpres.ReasonPhrase ?? "";
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, reason);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return new DmsImageByIdResult(body);
	}

	public async Task<DmsDetailByIdResult> GetDmsDetailByIdResult(int id)
	{
		string url = _config.DMS + $"/documents/{id}";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<DmsDetailByIdResult>(body)!;
	}

	public async Task<List<DmsByObjectTypeHiddenResult>> GetDmsByObjectTypeHidden(string objectType)
	{
		string url = _config.EndPoint + "/dms/documents/" + objectType + "/hidden";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<DmsByObjectTypeHiddenResult>>(body)!;
	}


	public async Task<List<DmsByObjectTypeAndKeyHiddenResult>> GetDmsByObjectTypeAndKeyHidden(string objectType, int objectKey)
	{
		string url = _config.EndPoint + "/dms/documents/" + objectType + "/" + objectKey + "/hidden";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<DmsByObjectTypeAndKeyHiddenResult>>(body)!;
	}
	#endregion

	#region CMS
	public async Task<CasesResult> CreateCases(string shortDesc, string? equipmentTag, int locationId, int eventTypeId, int? caseTypeId, string? caseDesc, string? requester)
	{
		string url = _config.CMS + "/cases";
		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			ShortDesc = shortDesc,
			EquipmentTag = equipmentTag,
			LocationId = locationId,
			EventTypeId = eventTypeId,
			CaseTypeId = caseTypeId,
			CaseDesc = caseDesc,
			Requester = requester
		});

		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<CasesResult>(body)!;
	}

	public async Task<List<EventTypesResult>> GetEventTypes()
	{
		string url = _config.CMS + "/eventtypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<EventTypesResult>>(body)!;
	}

	public async Task<List<CaseTypesResult>> GetCaseTypes()
	{
		string url = _config.CMS + "/casetypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseTypesResult>>(body)!;
	}

	public async Task<List<EventCategoriesResult>> GetEventCategories()
	{
		string url = _config.CMS + "/eventcategories";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<EventCategoriesResult>>(body)!;
	}

	public async Task<List<EventSubTypesResult>> GetEventSubTypes()
	{
		string url = _config.CMS + "/eventsubtypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<EventSubTypesResult>>(body)!;
	}

	public async Task<List<TaskStatusesResult>> GetTaskStatuses()
	{
		string url = _config.CMS + "/taskstatuses";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<TaskStatusesResult>>(body)!;
	}

	public async Task<List<SiteHandlersResult>> GetSiteHandlers()
	{
		string url = _config.CMS + "/sitehandlers";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<SiteHandlersResult>>(body)!;
	}

	public async Task<List<SlaConfigsResult>> GetSlaConfigs()
	{
		string url = _config.CMS + "/slaconfigs";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<SlaConfigsResult>>(body)!;
	}


	public async Task<List<CaseLocationsResult>> GetCaseLocations()
	{
		string url = _config.Core + "/locations";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseLocationsResult>>(body)!;
	}


	public async Task<List<CaseAssetCategoriesResult>> GetCaseAssetCategories()
	{
		string url = _config.Core + "/assetcategories";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseAssetCategoriesResult>>(body)!;
	}


	public async Task<GetCaseByIdResult> GetCaseById(int id)
	{
		string url = _config.CMS + "/cases/" + id;

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<GetCaseByIdResult>(body)!;
	}

	public async Task<GetCaseTaskByTaskIdResult> GetCaseTaskByTaskId(int caseid, int taskid)
	{
		string url = _config.CMS + "/cases/" + caseid + "/tasks/" + taskid;

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<GetCaseTaskByTaskIdResult>(body)!;
	}

	public async Task<List<CaseStatusResult>> GetCaseStatus()
	{
		string url = _config.CMS + "/casestatuses";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseStatusResult>>(body)!;
	}

	public async Task<List<TaskCategoryResult>> GetTaskCategory()
	{
		string url = _config.CMS + "/taskcategories";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<TaskCategoryResult>>(body)!;
	}

	public async Task<List<PriorityLevelResult>> GetPriorityLevel()
	{
		string url = _config.CMS + "/prioritylevels";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<PriorityLevelResult>>(body)!;
	}

	public async Task<List<IconResult>> GetIcons()
	{
		string url = _config.Core + "/icons";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<IconResult>>(body)!;
	}

	public async Task<List<CaseTaskResult>> GetCaseTaskByCaseId(int caseid)
	{
		string url = _config.CMS + "/cases/" + caseid + "/tasks";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseTaskResult>>(body)!;
	}

	public async Task<List<CaseMediaResult>> GetCaseMediaByCaseId(int caseid)
	{
		string url = _config.CMS + "/cases/" + caseid + "/media";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseMediaResult>>(body)!;
	}

	public async Task<List<CaseLocationTypeResult>> GetCaseLocationTypes()
	{
		string url = _config.Core + "/locationtypes";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseLocationTypeResult>>(body)!;
	}

	public async Task<List<CaseAssetResult>> GetCaseAssets()
	{
		string url = _config.Core + "/assets";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseAssetResult>>(body)!;
	}

	public async Task<CaseCreateTaskResult> PostCaseCreateTasks(string name, int caseid, int statuscode, int iscritical, string taskcategoryid)
	{
		string url = _config.CMS + "/cases/" + caseid + "/tasks";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			Name = name,
			CaseId = caseid,
			StatusCode = statuscode,
			IsCritical = iscritical,
			TaskCategoryId = taskcategoryid
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<CaseCreateTaskResult>(body)!;

	}
	public async Task<CaseUpdateTaskResult> UpdateTaskById(int id, string name, int caseid, int statuscode, int taskcategoryId, bool iscritical, int? assignedStaffId, string? assignedStaffDisplayName, string? createdBy, string? createdOn, int? sequence)
	{
		string url = _config.CMS + "/cases/" + caseid + "/tasks/";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new
		{
			Id = id,
			Name = name,
			CaseId = caseid,
			StatusCode = statuscode,
			TaskCategoryId = taskcategoryId,
			IsCritical = iscritical,
			AssignedStaffId = assignedStaffId,
			AssignedStaffDisplayName = assignedStaffDisplayName, 
			CreatedBy = createdBy, 
			CreatedOn = createdOn, 
			Sequence = sequence
		});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<CaseUpdateTaskResult>(body)!;
	}

	public async Task<List<CaseResult>> GetCases()
	{
		string url = _config.CMS + "/mobileapp/cases";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CaseResult>>(body)!;
	}

	public async Task<List<CasesUpdatesResult>> GetCasesUpdates(string? fromDate, string? toDate, string? countData, string? skipData)
	{
		string url = _config.CMS + $"/mobileapp/caseupdates?";

		if (fromDate != null)
		{
			url += "&from=" + fromDate;
		}

		if (toDate != null) 
		{
			url += "&to=" + toDate;
		}

		if (countData != null)
		{
			url += "&count=" + countData;
		}

		if (skipData != null)
		{
			url += "&skip=" + skipData;
		}

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CasesUpdatesResult>>(body)!;
	}

	public async Task<CreateMediaResult> CreateMedia(int caseId, IFormFile media)
	{
		string url = _config.CMS + $"/cases/{caseId}/media";
		string body = "";
		using (var form = new MultipartFormDataContent())
		{
			using (var streamContent = new StreamContent(media.OpenReadStream()))
			{
				using (var fileContent = new ByteArrayContent(await streamContent.ReadAsByteArrayAsync()))
				{
					string con = media.ContentType;
					fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(con); // jpeg, png, pdf

					form.Add(fileContent, "file", media.FileName);
					
					_logger.LogInformation("[Request-Multipart] URL: {Url}, Headers: {Headers}, File: {FileName}, Content-Type: {ContentType}",
								url,
								fileContent,
								media.FileName,
								con
						);

					var response = await GetClientFromFactory().PostAsync(url, form);
					body = await response.Content.ReadAsStringAsync();
					var reason = response.ReasonPhrase ?? "";
					_logger.LogInformation("[Response-Multipart] Status Code: {StatusCode}, Headers: {Headers}, Body: {ResponseBody}",
								response.StatusCode,
								response.Headers,
								body
						);

					if (!response.IsSuccessStatusCode) throw CertisServiceException.CTS002($"response:{reason}");
					var res = new CreateMediaResult()
					{
						CaseId = caseId,
						MediaName = media.FileName,
						IsSuccess = true,
					};
					return res;
				}
			}
		}
	}

	public async Task<List<CreateCWOWithCaseLinkResult>> CreateCWOWithCaseLink(CreateCWOWithCaseLinkCommand data)
	{
		string url = _config.CMS + "/cases/interface/" + data.CaseId + "/cwo";

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, new {});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<CreateCWOWithCaseLinkResult>>(body)!;
	}

	public async Task<UpdateCaseStatusResult> UpdateCaseStatus(UpdateCaseStatusCommand data)
	{
		string url = $"{_config.CMS}/cases/{data.CaseId}";

		var jsonString = JsonSerializer.Serialize(new 
		{
			Id = data.CaseId,
			data.StatusCode
		});
		var dataContent = JsonSerializer.Deserialize<JsonElement>(jsonString)!;

		using var client = await GetClientFromFactoryWithBearer();
		var httpres = await client.PutAsJsonAsync(url, dataContent);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<UpdateCaseStatusResult>(body)!;
	}

	#endregion

    #region Core
	public async Task<CreateStaffResult> CreateStaff(CreateStaffCommand data)
	{
		string url = $"{_config.Core}/staffs";

		var httpres = await (await GetClientFromFactoryWithBearer()).PostAsJsonAsync(url, data);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<CreateStaffResult>(body)!;
	}

	public async Task<List<GetStaffByBuildingResult>> GetStaffByBuilding(GetStaffByBuildingQuery data)
	{
		string url = $"{_config.Core}/locations/{data.LocationId}/staffs?";

		if (data.FRIDs != null) {
			url += $"frids={data.FRIDs}&";
		}

		if (data.Online != null) {
			url += $"online={data.Online}";
		}

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<GetStaffByBuildingResult>>(body)!;
	}

	public async Task<List<GetStaffRoleMappingResult>> GetStaffRoleMapping(GetStaffRoleMappingQuery data)
	{
		string url = $"{_config.Core}/staffs/{data.StaffCodeOrId}/functionroles";

		var httpres = await (await GetClientFromFactoryWithBearer()).GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<GetStaffRoleMappingResult>>(body)!;
	}
	
	public async Task<AddStaffRoleMappingResult> AddStaffRoleMapping(AddStaffRoleMappingCommand data)
	{
		string url = $"{_config.Core}/staffs/{data.StaffId}/functionroles";

		var httpres = await (await GetClientFromFactoryWithBearer()).PostAsJsonAsync(url, data);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<AddStaffRoleMappingResult>(body)!;
	}
	public async Task<UpdateStaffResult> UpdateStaff(UpdateStaffCommand data)
	{
		string url = $"{_config.Core}/staffs";

		var httpres = await (await GetClientFromFactoryWithBearer()).PutAsJsonAsync(url, data);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<UpdateStaffResult>(body)!;
	}
	public async Task<DeleteStaffRoleMappingResult> DeleteStaffRoleMapping(DeleteStaffRoleMappingCommand data)
	{
		string url = $"{_config.Core}/staffs/{data.StaffId}/functionroles?";

		if (data.FunctionRoleId != null) {
			url += $"functionRoleId={data.FunctionRoleId}&";
		}

		if (data.LocationId != null) {
			url += $"locationId={data.LocationId}";
		}

		var httpres = await (await GetClientFromFactoryWithBearer()).DeleteAsync(url);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CT001("Cannot delete staff role mapping");
		return new DeleteStaffRoleMappingResult();
	}
	public async Task<List<GetFunctionRolesResult>> GetFunctionRoles(GetFunctionRolesQuery data)
	{
		string url = $"{_config.Core}/functionroles";

		var httpres = await GetClientFromFactory().GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<GetFunctionRolesResult>>(body)!;
	}

	public async Task<List<GetStaffSearchResult>> GetStaffSearch(GetStaffSearchQuery data)
	{
		string url = $"{_config.Core}/staffs/search?";

		if (data.Search != null) {
			url += $"s={data.Search}";
		}

		var httpres = await (await GetClientFromFactoryWithBearer()).GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS001(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<GetStaffSearchResult>>(body)!;
	}
	

	#endregion


	//WFM
	public async Task<StaffClockInResult> StaffClockIn(StaffClockInCommand data)
	{
		string url = $"{_config.WFM}/attendance/{data.StaffId}/in?frid={data.FunctionRoleId}&shid={data.ShiftId}";

		var httpres = await (await GetClientFromFactoryWithBearer()).PostAsJsonAsync(url, new {});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<StaffClockInResult>(body)!;
	}

	public async Task<StaffClockOutResult> StaffClockOut(StaffClockOutCommand data)
	{
		string url = $"{_config.WFM}/attendance/{data.StaffId}/out";

		var httpres = await (await GetClientFromFactoryWithBearer()).PostAsJsonAsync(url, new {});
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<StaffClockOutResult>(body)!;
	}

	public async Task<List<DutyShiftsResult>> DutyShifts(DutyShiftsQuery data)
	{
		string url = $"{_config.WFM}/dutyshifts/schedules?";

		if (data.StaffId != null) {
			url += $"stafid={data.StaffId}&";
		}

		if (data.LocationId != null) {
			url += $"locid={data.LocationId}&";
		}

		if (data.StartDate != null) {
			url += $"start={data.StartDate}&";
		}

		if (data.EndDate != null) {
			url += $"end={data.EndDate}&";
		}

		if (data.CategoryId != null) {
			url += $"catid={data.CategoryId}&";
		}

		var httpres = await (await GetClientFromFactoryWithBearer()).GetAsync(url);
		var body = await httpres.Content.ReadAsStringAsync();
		var requestThirdPartyJson = GetRequestThirdPartyJson(httpres, body);
		if (!httpres.IsSuccessStatusCode) throw CertisServiceException.CTS002(requestThirdPartyJson);
		return JsonSerializer.Deserialize<List<DutyShiftsResult>>(body)!;
	}
}