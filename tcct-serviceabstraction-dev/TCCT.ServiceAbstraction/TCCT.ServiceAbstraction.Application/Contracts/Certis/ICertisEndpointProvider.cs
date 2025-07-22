using Microsoft.AspNetCore.Http;
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
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AssignTechnician;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ClientVerify;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Close;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CommentById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Complete;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWO;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Master;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Pause;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Resume;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Rework;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupervisorReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupportiveTeam;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.TechnicianReject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.UpdateTask;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOffline;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.WorkOnline;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyHidden;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeHidden;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.CheckListMaps;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.DocumentsRelatedById;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMMasterWorkOrder;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Command;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Query;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ServicingObject;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Technicians;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CasesUpdates;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.Users;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.CreateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffByBuilding;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.AddStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetFunctionRoles;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.DeleteStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.UpdateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffSearch;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWOUpdate;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CreateCWOExternal;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMUpdate;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CreateCWOWithCaseLink;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.IFM.CWOsbyincidentId;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.UpdateCaseStatus;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis;
public interface ICertisEndpointProvider
{
	// Assets Module
	Task<List<AssetCategoriesResult>> GetAssetCategories();
	Task<List<AssetGroupResult>> GetAssetGroups();
	Task<List<AssetResult>> GetAssets();

	// Location management
	Task<List<LocationTypeResult>> GetLocationTypes();
	Task<List<LocationsResult>> GetLocations();
	Task<LocationConfigResult> GetLocationConfig();

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

	// CWO - Corrective Work Order
	Task<List<CWOTypeResult>> GetCwoTypes();
	Task<List<CWOStatusCodeResult>> GetCwoStatusCodes();
	Task<CWODefaultConfigResult> GetCwoDefaultConfig();
	Task<Features.Certis.Transaction.CWO.AcknowledgeAssignment.AcknowledgeAssignmentResult> CWOAcknowledgeAssignment(int cwoId, Guid ackedBy, string ackVerifiedBy, string acknowledgementSignature, string supportiveTechnicianIds, bool isWorkingOffline, string workOfflineReason, int locationId, string description, int requesterId, int assetId);
	Task<Features.Certis.Transaction.CWO.AssignSupervisor.AssignSupervisorResult> CWOAssignSupervisor(int cwoId, Guid supervisorId, Guid assignedBy, int locationId, string description, int requesterId, int asset);
	Task<AssignTechnicianResult> CWOAssignTechnician(int cwoId, Guid assignedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int asset);
	Task<ClientVerifyResult> CWOClientVerify(int cwoId, string clientVerificationComment, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy);
	Task<CloseResult> CWOClose(int cwoId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy);
	Task<Features.Certis.Transaction.CWO.Comment.Command.CommentResult> CWOComment(int cwoId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy);
	Task<CompleteResult> CWOComplete(int cwoId, string completionComment, string completionAckedBy, string completionSignature, Guid completedBy, int locationId, string description, int requesterId, int? assetId);
	Task<ConfirmTaskCompletionResult> CWOConfirmTaskCompletion(int cwoId, Guid confirmedBy);
	Task<CWOResult> CWO(DateTime requestedOn, int requesterId, int cwoTypeId, int problemTypeId, int priorityId, int serviceCategoryId, int locationId, Guid createdBy, string description, int assetId);
	Task<PauseResult> CWOPause(int cwoId, Guid pausedBy, string reason);
	Task<ResumeResult> CWOResume(int cwoId, Guid resumedBy);
	Task<ReworkResult> CWORework(int cwoId, string reasonToRework, Guid reworkRequestedBy);
	Task<SupervisorRejectResult> CWOSupervisorReject(int cwoId, Guid rejectedBy, int locationId, string description, int requesterId, int assetId);
	Task<TechnicianRejectResult> CWOTechnicianReject(int cwoId, Guid rejectedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int assetId);
	Task<UpdateTaskResult> CWOUpdateTask(int id, string taskStatus, string remark, string reading, Guid updatedBy, DateTime updatedOn);
	Task<WorkOfflineResult> CWOWorkOffline(int cwoId, Guid workOfflineBy, string reason);
	Task<WorkOnlineResult> CWOWorkOnline(int cwoId, Guid reactivatedBy);
	Task<List<Features.Certis.Transaction.CWO.Task.TaskResult>> CWOTask(string cwoIdsCsv);
	Task<List<Features.Certis.Transaction.CWO.Comment.Query.CommentResult>> GetComments(string cwoIdsCsv);
	Task<List<CWOMasterResult>> CWOMaster();
	Task<List<CWOUpdateResult>> CWOUpdate(string? fromDate, string? toDate, string? countData, string? skipData);
	Task<List<SupportiveTeamResult>> CWOSupportiveTeam(string id);
	Task<List<Features.Certis.Transaction.CWO.Transactions.TransactionsResult>> CWOTransactions(string id);
	Task<List<CommentByIdResult>> CWOCommentById(string id);
	Task<List<DocumentsRelatedByIdResult>> CWODocumentsRelatedById(string id);
	Task<CreateCWOExternalResult> CWOExternal(CreateCWOExternalCommand data);
	Task<List<CWOsbyincidentIdResult>> CWOsbyincidentId(int id);

	// PPM - Plan and Preventive Maintainance
	Task<List<FrequencyTypeResult>> GetFrequencyTypes();
	Task<List<StatusCodesResult>> GetStatusCodes();
	Task<PPMDefaultConfigResult> GetDefaultConfig();
	Task<PPMWOResult> PPMWO(int mwoId, int checklistMapId);
	Task<Features.Certis.Transaction.PPM.AcknowledgeAssignment.AcknowledgeAssignmentResult> PPMAcknowledgeAssignment(int woId, Guid ackedBy, string acknowledgementSignature);
	Task<Features.Certis.Transaction.PPM.AssignSupervisor.AssignSupervisorResult> PPMAssignSupervisor(int woId, Guid supervisorId, Guid assignedBy);
	Task<Features.Certis.Transaction.PPM.AssignTechnician.AssignTechnicianResult> PPMAssignTechnician(int woId, string technicianIds, Guid assignedBy);
	Task<Features.Certis.Transaction.PPM.ClientVerify.ClientVerifyResult> PPMClientVerify(int woId, string clientVerificationComment, string clientVerifiedBy, string clientVerificationSignature, Guid clientVerificationSubmittedBy);
	Task<Features.Certis.Transaction.PPM.Close.CloseResult> PPMCloseResult(int woId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy);
	Task<CommentResult> PPMComment(int woId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy);
	Task<Features.Certis.Transaction.PPM.Complete.CompleteResult> PPMComplete(int woId, string completionComment, string completionSignature, Guid completedBy);
	Task<Features.Certis.Transaction.PPM.ConfirmTaskCompletion.ConfirmTaskCompletionResult> PPMConfirmTaskCompletion(int objectId, Guid confirmedBy);
	Task<Features.Certis.Transaction.PPM.Rework.ReworkResult> PPMRework(int woId, string reasonToRework, Guid reworkRequestedBy);
	Task<Features.Certis.Transaction.PPM.SupervisorReject.SupervisorRejectResult> PPMSupervisorReject(int woId, Guid rejectedBy);
	Task<Features.Certis.Transaction.PPM.TechnicianReject.TechnicianRejectResult> PPMTechnicianReject(int woId, Guid rejectedBy, Guid technicianId);
	Task<Features.Certis.Transaction.PPM.UpdateTask.UpdateTaskResult> PPMUpdateTask(int id, string taskStatus, string remarks, string reading, Guid updatedBy, DateTime updatedOn, string documentId);
	Task<List<PPMMasterWorkOrderResult>> PPMMasterWorkOrder();
	Task<List<PPMMasterResult>> PPMMaster();
	Task<List<CheckListMapsResult>> PPMCheckListMap();
	Task<List<TechniciansResult>> PPMTechnicians(string id);
	Task<List<CommentsResult>> PPMComments(string woid);
	Task<List<PPMDocumentsRelatedByIdResult>> PPMDocumentsRelatedById(string id);
	Task<List<Features.Certis.Transaction.PPM.Task.TaskResult>> GetTask(string workOrderId);
	Task<List<ServicingObjectResult>> GetServicingObject(string workOrderId);
	Task<List<Features.Certis.Transaction.PPM.Transactions.TransactionsResult>> PPMTransactions(string woid);
	Task<List<PPMUpdateResult>> PPMUpdate(string? fromDate, string? toDate, string? countData, string? skipData);
	// Others
	Task<List<UsersResult>> GetUsers();

	// Attachment
	Task<List<AttachmentTypeResult>> GetAttachmentTypes();
	Task<DocumentManagementResult> UploadDMS(int objectKey, string objectType, string description, string searchTags, string attachmentType, string isDefault, string isHidden, IFormFile image);
	Task<DmsImageByIdResult> GetDmsImageByIdResult(int id);
	Task<DmsDetailByIdResult> GetDmsDetailByIdResult(int id);
	Task<List<DmsByObjectTypeHiddenResult>> GetDmsByObjectTypeHidden(string objectType);
	Task<List<DmsByObjectTypeAndKeyHiddenResult>> GetDmsByObjectTypeAndKeyHidden(string objectType, int objectKey);


	// CMS
	Task<CasesResult> CreateCases(string shortDesc, string? equipmentTag, int locationId, int eventTypeId, int? caseTypeId, string? caseDesc, string? requester);
	Task<List<EventTypesResult>> GetEventTypes();
	Task<List<CaseTypesResult>> GetCaseTypes();
	Task<List<EventCategoriesResult>> GetEventCategories();
	Task<List<EventSubTypesResult>> GetEventSubTypes();
	Task<List<TaskStatusesResult>> GetTaskStatuses();
	Task<List<SiteHandlersResult>> GetSiteHandlers();
	Task<List<CreateCWOWithCaseLinkResult>> CreateCWOWithCaseLink(CreateCWOWithCaseLinkCommand data);
	Task<UpdateCaseStatusResult> UpdateCaseStatus(UpdateCaseStatusCommand data);
	//Bobby
	Task<List<SlaConfigsResult>> GetSlaConfigs();
	Task<List<CaseLocationsResult>> GetCaseLocations();
	Task<List<CaseAssetCategoriesResult>> GetCaseAssetCategories();
	Task<GetCaseByIdResult> GetCaseById(int id);
	Task<GetCaseTaskByTaskIdResult> GetCaseTaskByTaskId(int caseid, int taskid);

	Task<List<CaseStatusResult>> GetCaseStatus();
	Task<List<TaskCategoryResult>> GetTaskCategory();
	Task<List<PriorityLevelResult>> GetPriorityLevel();
	Task<List<CaseLocationTypeResult>> GetCaseLocationTypes();
	Task<List<CaseAssetResult>> GetCaseAssets();
	Task<List<IconResult>> GetIcons();
	Task<List<CaseResult>> GetCases();
	Task<List<CasesUpdatesResult>> GetCasesUpdates(string? fromDate, string? toDate, string? countData, string? skipData);
	Task<CreateMediaResult> CreateMedia(int caseId, IFormFile media);
	Task<CreateStaffResult> CreateStaff(CreateStaffCommand data);

	Task<List<CaseTaskResult>> GetCaseTaskByCaseId(int caseid);
	Task<List<CaseMediaResult>> GetCaseMediaByCaseId(int caseid);
	Task<CaseCreateTaskResult> PostCaseCreateTasks(string name, int caseid, int statuscode, int iscritical, string taskcategoryid);
	Task<CaseUpdateTaskResult> UpdateTaskById(int id, string name, int caseid, int statuscode, int taskcategoryId, bool iscritical, int? assignedStaffId, string? assignedStaffDisplayName, string? createdBy, string? createdOn, int? sequence);
	Task<List<GetStaffByBuildingResult>> GetStaffByBuilding(GetStaffByBuildingQuery data);
	Task<List<GetStaffRoleMappingResult>> GetStaffRoleMapping(GetStaffRoleMappingQuery data);
	Task<AddStaffRoleMappingResult> AddStaffRoleMapping(AddStaffRoleMappingCommand data);
	Task<UpdateStaffResult> UpdateStaff(UpdateStaffCommand data);
	Task<DeleteStaffRoleMappingResult> DeleteStaffRoleMapping(DeleteStaffRoleMappingCommand data);
	Task<List<GetFunctionRolesResult>> GetFunctionRoles(GetFunctionRolesQuery data);
	Task<List<GetStaffSearchResult>> GetStaffSearch(GetStaffSearchQuery data);
	
	// WFM
	Task<StaffClockInResult> StaffClockIn(StaffClockInCommand data);
	Task<StaffClockOutResult> StaffClockOut(StaffClockOutCommand data);
	Task<List<DutyShiftsResult>> DutyShifts(DutyShiftsQuery data);
}
