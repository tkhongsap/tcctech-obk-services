using Microsoft.Extensions.Caching.Memory;
using TCCTOBK.OperationBackend.Application;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWODefaultConfig;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOStatusCode;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedChecklist;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedChecklistTask;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedCommentType;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMSupervisor;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMSupervisorService;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMTechnician;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedFMTechnicianService;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedPriority;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedProblemType;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedRequester;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedRequesterType;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceCategory;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceCategoryServingLocation;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedServiceProvider;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.FMTechnician.Model;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Infrastructure.API;
public class MasterDataService : IMasterDataService

{
	IMemoryCache _cache;
	Semaphore _semaphore;
	private readonly string _cachePrefix = "MasterData:";
	private readonly int _cacheExpireIn = 3600;
	private readonly IClientSiteService _clientSiteService;
	string _prefixCache = Constant.OBK_CLIENT_SITE_NAME;
	string _domainUrl = DomainConfig.Abstraction.AbstractionURL;
	public MasterDataService(IMemoryCache memoryCache, IClientSiteService clientSiteService)
	{
		_cache = memoryCache;
		_semaphore = new Semaphore(2, 2);
		_clientSiteService = clientSiteService;
		if (_clientSiteService.ClientSiteId == Constant.PARQ_CLIENT_SITE)
		{
			_prefixCache = Constant.PARQ_CLIENT_SITE_NAME;
			_domainUrl = DomainConfig.Abstraction.AbstractionParqURL;
			_cachePrefix = _prefixCache + _cachePrefix;
		}
	}

	public async Task<T> GetFromCacheOrQuery<T>(string key, int expires_in, Func<Task<T>> func)
	{
		try
		{
			_semaphore.WaitOne();
			if (!_cache.TryGetValue(key, out T? item))
			{
				item = await func();
				_cache.Set(key, item, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromSeconds(expires_in)));
			}
			return item!;
		}
		finally
		{
			_semaphore.Release();
		}
	}

	public async Task<List<LocationsResult>> GetAllLocation(Func<Task<List<LocationsResult>>> func)
	{
		string keyCache = _cachePrefix + "Locations";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}

	public async Task<List<FMTechnicianResult>> GetAllFMTechnician(Func<Task<List<FMTechnicianResult>>> func)
	{
		string keyCache = _cachePrefix + "FMTechnician";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMTechniciansServiceResult>> FMTechnicianServices(Func<Task<List<FMTechniciansServiceResult>>> func)
	{
		string keyCache = _cachePrefix + "FMTechniciansService";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<AssetResult>> GetAllAssets(Func<Task<List<AssetResult>>> func)
	{
		string keyCache = _cachePrefix + "Asset";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<StatusWork>> GetAllStatus(Func<Task<List<StatusWork>>> func)
	{
		string keyCache = _cachePrefix + "StatusWork";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<ServiceCategoriesCertisResult>> GetServiceCategories(Func<Task<List<ServiceCategoriesCertisResult>>> func)
	{
		string keyCache = _cachePrefix + "ServiceCategoriesCertis";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMSupervisorsCertisResult>> FMsupervisors(Func<Task<List<FMSupervisorsCertisResult>>> func)
	{
		string keyCache = _cachePrefix + "FMSupervisorsCertis";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMSupervisorsServicesResult>> FMSupervisorsServices(Func<Task<List<FMSupervisorsServicesResult>>> func)
	{
		string keyCache = _cachePrefix + "FMSupervisorsServices";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<ProblemTypesResult>> ProblemTypes(Func<Task<List<ProblemTypesResult>>> func)
	{
		string keyCache = _cachePrefix + "ProblemTypes";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<CWOTypeResult>> CWOType(Func<Task<List<CWOTypeResult>>> func)
	{
		string keyCache = _cachePrefix + "CWOType";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<RequestersResult>> Requesters(Func<Task<List<RequestersResult>>> func)
	{
		string keyCache = _cachePrefix + "Requesters";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<ServiceProviderResult>> GetServiceProvider(Func<Task<List<ServiceProviderResult>>> func)
	{
		string keyCache = _cachePrefix + "ServiceProvider";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOType.CWOTypeResult>> CWOTypes(Func<Task<List<TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOType.CWOTypeResult>>> func)
	{
		string keyCache = _cachePrefix + "CWOTypes";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<CWOStatusCodeResult>> CWOStatusCode(Func<Task<List<CWOStatusCodeResult>>> func)
	{
		string keyCache = _cachePrefix + "CWOStatusCode";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<CWODefaultConfigResult>> CWODefaultConfig(Func<Task<List<CWODefaultConfigResult>>> func)
	{
		string keyCache = _cachePrefix + "CWODefaultConfig";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedPriorityResult>> FMRelatedPriorities(Func<Task<List<FMRelatedPriorityResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedPriority";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedRequesterTypeResult>> FMRelatedRequestersTypes(Func<Task<List<FMRelatedRequesterTypeResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedRequesterType";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedRequesterResult>> FMRelatedRequesters(Func<Task<List<FMRelatedRequesterResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedRequester";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedCommentTypeResult>> FMRelatedCommentTypes(Func<Task<List<FMRelatedCommentTypeResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedCommentType";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedServiceProviderResult>> FMRelatedServiceProviders(Func<Task<List<FMRelatedServiceProviderResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedServiceProvider";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedServiceCategoryResult>> FMRelatedServiceCategories(Func<Task<List<FMRelatedServiceCategoryResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedServiceCategory";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedServiceCategoryServingLocationResult>> FMRelatedServiceCategoriesServingLocations(Func<Task<List<FMRelatedServiceCategoryServingLocationResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedServiceCategoryServingLocation";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedProblemTypeResult>> FMRelatedProblemTypes(Func<Task<List<FMRelatedProblemTypeResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedProblemType";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedChecklistResult>> FMRelatedChecklists(Func<Task<List<FMRelatedChecklistResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedChecklist";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedChecklistTaskResult>> FMRelatedChecklistsTasks(Func<Task<List<FMRelatedChecklistTaskResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedChecklistTask";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedFMSupervisorResult>> FMRelatedFMSupervisors(Func<Task<List<FMRelatedFMSupervisorResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedFMSupervisor";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedFMSupervisorServiceResult>> FMRelatedFMSupervisorsServices(Func<Task<List<FMRelatedFMSupervisorServiceResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedFMSupervisorService";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedFMTechnicianResult>> FMRelatedFMTechnicians(Func<Task<List<FMRelatedFMTechnicianResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedFMTechnician";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<FMRelatedFMTechnicianServiceResult>> FMRelatedFMTechniciansServices(Func<Task<List<FMRelatedFMTechnicianServiceResult>>> func)
	{
		string keyCache = _cachePrefix + "FMRelatedFMTechnicianService";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<CaseEventType>> GetCaseEventType(Func<Task<List<CaseEventType>>> func)
	{
		string keyCache = _cachePrefix + "CaseEventType";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<CaseLocation>> GetCaseLocation(Func<Task<List<CaseLocation>>> func)
	{
		string keyCache = _cachePrefix + "CaseLocation";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
	public async Task<List<Users>> GetMasterUsers(Func<Task<List<Users>>> func)
	{
		string keyCache = _cachePrefix + "MasterUsers";
		return await GetFromCacheOrQuery(keyCache, _cacheExpireIn, func);
	}
}
