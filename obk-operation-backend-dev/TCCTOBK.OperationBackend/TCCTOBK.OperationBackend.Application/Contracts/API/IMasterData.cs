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

public interface IMasterData
{
	[Get("/api/v1/certis/Locations")]
	Task<List<LocationsResult>> GetAllLocation();

	[Get("/api/v1/certis/Locations/Types")]
	Task<List<LocationsTypeResult>> GetAllLocationsType();

	[Get("/api/v1/certis/FMRelated/FMTechnicians")]
	Task<List<FMTechnicianResult>> GetAllFMTechnician();

	[Get("/api/v1/certis/FMRelated/FMTechnicians/Services")]
	Task<List<FMTechniciansServiceResult>> FMTechnicianServices();

	[Get("/api/v1/certis/Assets")]

	Task<List<AssetResult>> GetAllAssets();

	[Get("/api/v1/certis/CWO/statuscode")]
	Task<List<StatusWork>> GetAllStatus();

	//tower

	//issuetype
	[Get("/api/v1/certis/FMRelated/ServiceCategories")]
	Task<List<ServiceCategoriesCertisResult>> GetServiceCategories();
	[Get("/api/v1/certis/FMRelated/FMSupervisors")]
	Task<List<FMSupervisorsCertisResult>> FMsupervisors();

	[Get("/api/v1/certis/FMRelated/FMSupervisors/Services")]
	Task<List<FMSupervisorsServicesResult>> FMSupervisorsServices();

	[Get("/api/v1/certis/FMRelated/ProblemTypes")]
	Task<List<ProblemTypesResult>> ProblemTypes();
	[Get("/api/v1/certis/CWO/types")]
	Task<List<CWOTypeResult>> CWOType();

	[Get("/api/v1/certis/FMRelated/Requesters")]
	Task<List<RequestersResult>> Requesters();

	[Get("/api/v1/certis/FMRelated/ServiceProviders")]
	Task<List<ServiceProviderResult>> GetServiceProvider();


	#region mobile masterdata cwo

	[Get("/api/mobile/v1/CWO/types")]
	Task<List<TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOType.CWOTypeResult>> CWOTypes();

	[Get("/api/mobile/v1/CWO/Statuscode")]
	Task<List<CWOStatusCodeResult>> CWOStatusCode();

	[Get("/api/mobile/v1/CWO/defaultconfig")]
	Task<List<CWODefaultConfigResult>> CWODefaultConfig();
	#endregion


	#region mobile masterdata fm related

	[Get("/api/v1/certis/FMRelated/Priorities")]
	Task<List<FMRelatedPriorityResult>> FMRelatedPriorities();


	[Get("/api/mobile/v1/FMRelated/Requesters/Types")]
	Task<List<FMRelatedRequesterTypeResult>> FMRelatedRequestersTypes();
	[Get("/api/mobile/v1/FMRelated/Requesters")]
	Task<List<FMRelatedRequesterResult>> FMRelatedRequesters();
	[Get("/api/mobile/v1/FMRelated/CommentTypes")]
	Task<List<FMRelatedCommentTypeResult>> FMRelatedCommentTypes();
	[Get("/api/mobile/v1/FMRelated/ServiceProviders")]
	Task<List<FMRelatedServiceProviderResult>> FMRelatedServiceProviders();
	[Get("/api/v1/certis/FMRelated/ServiceCategories")]
	Task<List<FMRelatedServiceCategoryResult>> FMRelatedServiceCategories();
	[Get("/api/v1/certis/FMRelated/ServiceCategories/ServingLocations ")]
	Task<List<FMRelatedServiceCategoryServingLocationResult>> FMRelatedServiceCategoriesServingLocations();
	[Get("/api/v1/certis/FMRelated/ProblemTypes")]
	Task<List<FMRelatedProblemTypeResult>> FMRelatedProblemTypes();
	[Get("/api/mobile/v1/FMRelated/Checklists")]
	Task<List<FMRelatedChecklistResult>> FMRelatedChecklists();
	[Get("/api/mobile/v1/FMRelated/Checklists/Tasks")]
	Task<List<FMRelatedChecklistTaskResult>> FMRelatedChecklistsTasks();
	[Get("/api/mobile/v1/FMRelated/FMSupervisors")]
	Task<List<FMRelatedFMSupervisorResult>> FMRelatedFMSupervisors();
	[Get("/api/mobile/v1/FMRelated/FMSupervisors/Services")]
	Task<List<FMRelatedFMSupervisorServiceResult>> FMRelatedFMSupervisorsServices();
	[Get("/api/mobile/v1/FMRelated/FMTechnicians")]
	Task<List<FMRelatedFMTechnicianResult>> FMRelatedFMTechnicians();
	[Get("/api/mobile/v1/FMRelated/FMTechnicians/Services")]
	Task<List<FMRelatedFMTechnicianServiceResult>> FMRelatedFMTechniciansServices();
	#endregion

	#region  caseincident

	[Get("/api/v1/certis/cms/cases/event/types")]
	Task<List<CaseEventType>> GetCaseEventType();

	[Get("/api/v1/certis/cms/cases/locations")]
	Task<List<CaseLocation>> GetCaseLocation();
	#endregion


	[Get("/api/v1/certis/master/users")]
	Task<List<Users>> GetMasterUsers();
}
