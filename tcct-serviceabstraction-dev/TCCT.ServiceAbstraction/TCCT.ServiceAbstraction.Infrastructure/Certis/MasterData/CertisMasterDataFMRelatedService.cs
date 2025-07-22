using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
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

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
public partial class CertisMasterDataFMRelatedService : ICertisMasterDataFMRelatedService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisMasterDataFMRelatedService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public async Task<List<CheckListResult>> GetCheckLists()
	{
		return await _endpointprovider.GetCheckLists();
	}

	public async Task<List<CheckListTaskResult>> GetCheckListTasks()
	{
		return await _endpointprovider.GetCheckListTasks();
	}

	public async Task<List<CommentTypeResult>> GetCommentTypes()
	{
		return await _endpointprovider.GetCommentTypes();
	}

	public async Task<List<FMSupervisorResult>> GetFMSupervisors()
	{
		return await _endpointprovider.GetFMSupervisors();
	}

	public async Task<List<FMSupervisorServiceResult>> GetFMSupervisorServices()
	{
		return await _endpointprovider.GetFMSupervisorServices();
	}

	public async Task<List<FMTechnicianResult>> GetFMTechnicians()
	{
		return await _endpointprovider.GetFMTechnicians();
	}

	public async Task<List<FMTechnicianServiceResult>> GetFMTechnicianServices()
	{
		return await _endpointprovider.GetFMTechnicianServices();
	}

	public async Task<List<PriorityResult>> GetPriorities()
	{
		return await _endpointprovider.GetPriorities();
	}

	public async Task<List<ProblemTypeResult>> GetProblemTypes()
	{
		return await _endpointprovider.GetProblemTypes();
	}

	public async Task<List<RequesterResult>> GetRequesters()
	{
		return await _endpointprovider.GetRequesters();
	}

	public async Task<List<RequesterTypeResult>> GetRequesterTypes()
	{
		return await _endpointprovider.GetRequesterTypes();
	}

	public async Task<List<ServiceCategoryResult>> GetServiceCategories()
	{
		return await _endpointprovider.GetServiceCategories();
	}

	public async Task<List<ServiceProviderResult>> GetServiceProviders()
	{
		return await _endpointprovider.GetServiceProviders();
	}

	public async Task<List<ServingLocationResult>> GetServingLocations()
	{
		return await _endpointprovider.GetServingLocations();
	}
}
