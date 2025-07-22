using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;
using TCCTOBK.OperationBackend.Application.Features;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.CWOCommentModel;
using TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Model.PPMCommentModel;
using TCCTOBK.OperationBackend.Application.Features.Mobile.PPM.Model.PPMTranactionModel;
using TCCTOBK.OperationBackend.Application.Features.Mobile.SOC.Command.CreateCaseIncident;
using TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Model;
using TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Model;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetFunctionRoles;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Core;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO.AssignSupervisorModel;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.Staff;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Document.Model;
using TCCTOBK.OperationBackend.Application.Features.Mobile.User.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.API;
public interface IAbstractionCertisTransactionService
{
	#region PPM
	[Get("/api/v1/certis/PPM/PPMWOS")]
	Task<List<PPMMasterResult>> GetAllPPMWorkOrderList();

	[Get("/api/v1/certis/PPM/Task/{workOrderId}")]
	Task<List<PPMTaskModel>> GetPPMTask(int workOrderId);

	[Get("/api/v1/certis/PPM/PPMMWOS")]
	Task<List<PPMMasterWorkOrder>> GetAllPPMWOS();
	[Post("/api/v1/certis/PPM/Assign/Technician")]
	Task<PPMAssignTechnicianResponseModel> AssignTechnicianPPM([Body] PPMAssignTechnicianRequestModel request);
	[Post("/api/v1/certis/PPM/Supervisor/Reject")]
	Task<SupervisorRejectResponsePPMModel> SupervisorRejectPPM([Body] SupervisorRejectRequestPPMModel request);
	[Post("/api/v1/certis/PPM/Technician/Reject")]
	Task<TechnicianRejectResponsePPMModel> TechnicianRejectPPM([Body] TechnicianRejectRequestPPMModel request);
	[Post("/api/v1/certis/PPM/Technician/Acknowldge")]
	Task<AcknowledgePPMResult> AcknowlegePPM([Body] AcknowledgePPMRequest request);
	[Post("/api/v1/certis/PPM/Task/Update")]
	Task<UpdatePPMResponse> UpdatePPM([Body] UpdatePPMRequest request);
	[Post("/api/v1/certis/PPM/Task/Complete")]
	Task<PPMComplteTaskResult> PPMComplateTask([Body] PPMComplteTaskRequest request);
	[Post("/api/v1/certis/PPM/Task/ConfirmCompletion")]
	Task<ConfirmCompletionResponsePPMModel> ConfirmCompletionPPM([Body] ConfirmCompletionRequestPPMModel request);
	[Post("/api/v1/certis/PPM/Task/Close")]
	Task<ClosePPMResultModel> ClosePPM([Body] ClosePPMRequestModel request);
	[Post("/api/v1/certis/PPM/Task/Rework")]
	Task<ReworkPPMResultModel> ReworkPPM([Body] ReworkPPMRequestModel request);
	[Post("/api/v1/certis/PPM/Comment")]
	Task<CommentPPMResponseModel> CommentPPM([Body] CommentPPMRequestModel request);
	[Get("/api/v1/certis/PPM/Comments/{woid}")]
	Task<GetCommentByWOIDResultModel> GetCommentByWOID(int woid);
	[Get("/api/v1/certis/PPM/ServicingObject/{workOrderId}")]
	Task<List<GetServiceObjectWorkIdModel>> GetServiceObjectWorkId(int workOrderId);

	[Get("/api/v1/certis/PPM/Transactions/{woid}")]
	Task<List<PPMTransactionResponseModel>> GetPPMTransaction(int woid);
	[Get("/api/v1/certis/PPM/Comments/{woid}")]
	Task<List<PPMCommentResponseModel>> GetPPMComment(int woid);
	[Get("/api/v1/certis/PPM/Documents/{id}/Related")]
	Task<List<PPMDocumentRelated>> PPMDocumentsRelated(int id);
	[Get("/api/v1/certis/PPM/ppmupdates")]
	Task<List<PPMUpdatesResult>> GetPPMUpdatesList([Query] string? from, [Query] string? to);


	#endregion
	#region Document
	//Upload PPM CWO
	[Multipart]
	[Post("/api/v1/certis/DMS")]
	Task<DocumentCertisResult> UploadDocument(int objectKey, string objectType, string description, string searchTags, string attachmentType, string isDefault, string isHidden, ByteArrayPart image);

	[Get("/api/v1/certis/DMS/Documents/{objectType}/hidden")]
	Task<List<DocumentCertisResult>> GetDocumentFiles(string objectType);

	[Get("/api/v1/certis/DMS/Documents/{objectType}/{objectKey}/hidden")]
	Task<List<DocumentCertisResult>> GetDocumentFiles(string objectType, string objectKey);

	[Get("/api/v1/certis/DMS/Documents/image/{id}")]
	Task<HttpResponseMessage> GetImage(string id);

	#endregion
	#region CWO
	//Create SOC 
	[Post("/api/v1/certis/CWO/CWO")]
	Task<CreateSOCIncidentResult> CreateSoc([Body] CreateSOCIncidentModel request);
	[Post("/api/v1/certis/CWO/CWO")]
	Task<CreateSOCIncidentResult> CreateCWO([Body] CreateSOCIncidentModel request);
	[Post("/api/v1/certis/CWO/Acknowledge/Assignment")]
	Task<AcknowledgeCWOResult> AcknowlegeCWO([Body] AcknowledgeCWORequest request);
	[Get("/api/v1/certis/CWO/Task?cwoId={cwoId}")]
	Task<List<CWOTaskModel>> GetCWODetail(string cwoId);
	[Get("/api/v1/certis/CWO/CWOS")]
	Task<List<CWOMasterResult>> GetAllCorrectiveWorkOrder();
	//Addsign Technician
	[Post("/api/v1/certis/CWO/Assign/Technician")]
	Task<AssignTechnicianModelResult> AssignTechnician([Body] AssignTechnicianRequest request);

	[Post("/api/v1/certis/CWO/Assign/Supervisor")]
	Task<AssignSupervisorResponse> AssignSupervisor([Body] AssignSupervisorRequest request);
	//Close CWO
	[Post("/api/v1/certis/CWO/Task/Close")]
	Task<CloseCWOResponseModel> CloseCWO([Body] CloseCWORequestModel request);
	//Pause CWO
	[Post("/api/v1/certis/CWO/Pause")]
	Task<PauseCWOResponse> PauseCWO([Body] PauseCWORequest request);
	//Resume CWO
	[Post("/api/v1/certis/CWO/Resume")]
	Task<ResumeCWOResponse> ResumeCWO([Body] ResumeCWORequest request);
	//Rework CWO
	[Post("/api/v1/certis/CWO/Task/Rework")]
	Task<ReworkCWOResponseModel> ReworkCWO([Body] ReworkCWORequestModel request);
	//Supervisor Reject CWO
	[Post("/api/v1/certis/CWO/Supervisor/Reject")]
	Task<SupervisorRejectResponseModel> SupervisorRejectCWO([Body] SupervisorRejectRequestModel request);
	//Technician Reject CWO
	[Post("/api/v1/certis/CWO/Technician/Reject")]
	Task<SupervisorRejectResponseModel> TechnicianRejectCWO([Body] TechnicianRejectRequestModel request);
	[Post("/api/v1/certis/CWO/Task/Update")]
	Task<UpdateCWOResponse> UpdateCWO([Body] UpdateCWORequest request);

	[Post("/api/v1/certis/CWO/Task/Complete")]
	Task<CWOComplteTaskResult> CWOCompleteTask([Body] CWOComplteTaskRequest request);


	//Reject PPM CWO
	[Post("/api/v1/certis/CWO/Technician/Reject")]
	Task<RejectCWOResponse> RejectCWO([Body] RejectCWORequest request);
	[Post("/api/v1/certis/PPM/Technician/Reject")]
	Task<RejectPPMModel> RejectPPM([Body] RejectPPMRequest request);

	[Post("/api/v1/certis/CWO/Task/Update")]
	Task<UpdateTaskResponseModel> UpdateCWOTask([Body] UpdateTaskCWORequestModel request);
	[Post("/api/v1/certis/CWO/Task/ConfirmCompletion")]
	Task<ConfrimCompletionResponseModel> ConfirmCompleteCWO([Body] ConfrimCompletionRequestModel request);

	[Get("/api/v1/certis/CWO/Transactions/{id}")]
	Task<List<CWOTransaction>> CWOTransactions(int id);

	[Post("/api/v1/certis/CWO/Comment")]
	Task<CWOCommentResponseModel> CommentCWO([Body] CWOCommentRequestModel request);
	[Get("/api/v1/certis/CWO/Comment")]
	Task<List<CWOCommentModel>> GetCommentCWO([Query] string cwoId);
	[Get("/api/v1/certis/CWO/Documents/{id}/Related")]
	Task<List<CWODocumentRelated>> CWODocumentsRelated(int id);

	[Get("/api/v1/certis/CWO/cwoupdates")]
	Task<List<CWOUpdatesResult>> GetCWOUpdatesList([Query] string? from, [Query] string? to);
	#endregion

	#region CMS
	[Get("/api/v1/certis/cms/cases")]
	Task<List<CaseIncidentItem>> GetCaseIndidentList(long? lastSyncUtcTs);
	[Get("/api/v1/certis/cms/cases/cases/{id}")]
	Task<CaseIncidentDetailResult> GetCaseIndidentDetail(int id);
	[Post("/api/v1/certis/cms/cases")]
	Task<CreateCaseIncidentResult> CreateCaseIncident(CreateCaseIncidentCommand request);
	[Get("/api/v1/certis/cms/cases/{caseId}/tasks")]
	Task<List<CaseIncidentTaskItem>> GetCaseIndidentTasks(int caseId);
	[Patch("/api/v1/certis/cms/cases/task")]
	Task<UpdateTaskSOCResponseModel> UpdateTaskSOC([Body] UpdateTaskSOCRequest request);
	[Get("/api/v1/certis/cms/cases/{caseId}/media")]
	Task<List<CreateCaseMediasModel>> GetCaseIndidentMedias(int caseId);
	[Get("/api/v1/certis/cms/cases/updates")]
	Task<List<CaseIncidentItem>> GetCaseIndidentUpdatesList([Query] string? from, [Query] string? to);
	[Multipart]
	[Post("/api/v1/certis/cms/cases/media")]
	Task<UploadMediaResult> CreateCaseMedia(
		[AliasAs("CaseId")] int caseId,
		[AliasAs("Media")] StreamPart media);
	#endregion


	#region Core
	[Get("/api/v1/certis/cms/core/functionroles")]
	Task<List<GetFunctionRolesResult>> GetFunctionRoles();

	[Post("/api/v1/certis/cms/core/staff")]
	Task<CreateStaffResult> CreateStaff([Body] CreateStaffCommand request);

	[Put("/api/v1/certis/cms/core/staff")]
	Task<UpdateStaffResult> UpdateStaff([Body] UpdateStaffCommand request);

	[Post("/api/v1/certis/cms/core/staffs/functionroles")]
	Task<AddStaffRoleMappingResult> AddStaffRoleMapping([Body] AddStaffRoleMappingCommand request);

	[Delete("/api/v1/certis/cms/core/staffs/functionroles")]
	Task<DeleteStaffRoleMappingResult> DeleteStaffRoleMapping([Body] DeleteStaffRoleMappingCommand request);
	[Get("/api/v1/certis/cms/core/locations/{locationId}/staffs")]
	Task<List<GetStaffByBuildingResult>> GetStaffByLocation(int locationId, [Query] string? frids, [Query] int? online);
	[Get("/api/v1/certis/cms/core/staffs/{staffId}/functionroles")]
	Task<List<GetFunctionRolesAPIResult>> GetFunctionRolesByStaffId(int? staffId);

	[Get("/api/v1/certis/cms/core/staffs/search")]
	Task<List<GetStaffByEmailResult>> GetStaffByEmail([Query] string? search);


	//WFM
	[Post("/api/v1/certis/cms/wfm/staff/clockin")]
	Task<ClockInResponseModel> wfmClockIn([Body] ClockInModel request);

	[Post("/api/v1/certis/cms/wfm/staff/clockout")]
	Task<ClockOutResponseModel> wfmClockOut([Body] ClockOutModel request);
	#endregion
}
