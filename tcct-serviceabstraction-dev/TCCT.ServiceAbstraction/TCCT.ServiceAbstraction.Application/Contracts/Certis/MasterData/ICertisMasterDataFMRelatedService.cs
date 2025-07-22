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

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
public interface ICertisMasterDataFMRelatedService
{
	// FM Related
	Task<List<PriorityResult>> GetPriorities();
	Task<List<RequesterTypeResult>> GetRequesterTypes();
	Task<List<RequesterResult>> GetRequesters();
	Task<List<CommentTypeResult>> GetCommentTypes();
	Task<List<ServiceProviderResult>> GetServiceProviders();
	Task<List<ServiceCategoryResult>> GetServiceCategories();
	Task<List<ServingLocationResult>> GetServingLocations();
	Task<List<ProblemTypeResult>> GetProblemTypes();
	Task<List<CheckListResult>> GetCheckLists();
	Task<List<CheckListTaskResult>> GetCheckListTasks();
	Task<List<FMSupervisorResult>> GetFMSupervisors();
	Task<List<FMSupervisorServiceResult>> GetFMSupervisorServices();
	Task<List<FMTechnicianResult>> GetFMTechnicians();
	Task<List<FMTechnicianServiceResult>> GetFMTechnicianServices();
}
