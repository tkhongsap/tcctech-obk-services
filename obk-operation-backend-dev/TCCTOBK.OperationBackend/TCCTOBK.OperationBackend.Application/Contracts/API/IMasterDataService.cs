using Refit;
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

namespace TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

public interface IMasterDataService
{
	Task<List<LocationsResult>> GetAllLocation(Func<Task<List<LocationsResult>>> func);
	Task<List<FMTechnicianResult>> GetAllFMTechnician(Func<Task<List<FMTechnicianResult>>> func);
	Task<List<FMTechniciansServiceResult>> FMTechnicianServices(Func<Task<List<FMTechniciansServiceResult>>> func);
	Task<List<AssetResult>> GetAllAssets(Func<Task<List<AssetResult>>> func);
	Task<List<StatusWork>> GetAllStatus(Func<Task<List<StatusWork>>> func);
	Task<List<ServiceCategoriesCertisResult>> GetServiceCategories(Func<Task<List<ServiceCategoriesCertisResult>>> func);
	Task<List<FMSupervisorsCertisResult>> FMsupervisors(Func<Task<List<FMSupervisorsCertisResult>>> func);
	Task<List<FMSupervisorsServicesResult>> FMSupervisorsServices(Func<Task<List<FMSupervisorsServicesResult>>> func);
	Task<List<ProblemTypesResult>> ProblemTypes(Func<Task<List<ProblemTypesResult>>> func);
	Task<List<CWOTypeResult>> CWOType(Func<Task<List<CWOTypeResult>>> func);
	Task<List<RequestersResult>> Requesters(Func<Task<List<RequestersResult>>> func);
	Task<List<ServiceProviderResult>> GetServiceProvider(Func<Task<List<ServiceProviderResult>>> func);
	Task<List<TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOType.CWOTypeResult>> CWOTypes(Func<Task<List<TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOType.CWOTypeResult>>> func);
	Task<List<CWOStatusCodeResult>> CWOStatusCode(Func<Task<List<CWOStatusCodeResult>>> func);
	Task<List<CWODefaultConfigResult>> CWODefaultConfig(Func<Task<List<CWODefaultConfigResult>>> func);
	Task<List<FMRelatedPriorityResult>> FMRelatedPriorities(Func<Task<List<FMRelatedPriorityResult>>> func);
	Task<List<FMRelatedRequesterResult>> FMRelatedRequesters(Func<Task<List<FMRelatedRequesterResult>>> func);
	Task<List<FMRelatedCommentTypeResult>> FMRelatedCommentTypes(Func<Task<List<FMRelatedCommentTypeResult>>> func);
	Task<List<FMRelatedServiceProviderResult>> FMRelatedServiceProviders(Func<Task<List<FMRelatedServiceProviderResult>>> func);
	Task<List<FMRelatedServiceCategoryResult>> FMRelatedServiceCategories(Func<Task<List<FMRelatedServiceCategoryResult>>> func);
	Task<List<FMRelatedServiceCategoryServingLocationResult>> FMRelatedServiceCategoriesServingLocations(Func<Task<List<FMRelatedServiceCategoryServingLocationResult>>> func);
	Task<List<FMRelatedProblemTypeResult>> FMRelatedProblemTypes(Func<Task<List<FMRelatedProblemTypeResult>>> func);
	Task<List<FMRelatedChecklistResult>> FMRelatedChecklists(Func<Task<List<FMRelatedChecklistResult>>> func);
	Task<List<FMRelatedChecklistTaskResult>> FMRelatedChecklistsTasks(Func<Task<List<FMRelatedChecklistTaskResult>>> func);
	Task<List<FMRelatedFMSupervisorResult>> FMRelatedFMSupervisors(Func<Task<List<FMRelatedFMSupervisorResult>>> func);
	Task<List<FMRelatedFMSupervisorServiceResult>> FMRelatedFMSupervisorsServices(Func<Task<List<FMRelatedFMSupervisorServiceResult>>> func);
	Task<List<FMRelatedFMTechnicianResult>> FMRelatedFMTechnicians(Func<Task<List<FMRelatedFMTechnicianResult>>> func);
	Task<List<FMRelatedFMTechnicianServiceResult>> FMRelatedFMTechniciansServices(Func<Task<List<FMRelatedFMTechnicianServiceResult>>> func);
	Task<List<CaseEventType>> GetCaseEventType(Func<Task<List<CaseEventType>>> func);
	Task<List<CaseLocation>> GetCaseLocation(Func<Task<List<CaseLocation>>> func);
	Task<List<FMRelatedRequesterTypeResult>> FMRelatedRequestersTypes(Func<Task<List<FMRelatedRequesterTypeResult>>> func);
	Task<List<Users>> GetMasterUsers(Func<Task<List<Users>>> func);
}
