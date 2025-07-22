using Microsoft.AspNetCore.Http;
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
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CasesUpdates;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CreateCWOWithCaseLink;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.UpdateCaseStatus;


namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
public interface ICertisTransactionCMSService
{
	Task<CasesResult> CreateCases(string shortDesc, string? equipmentTag, int locationId, int eventTypeId, int? caseTypeId, string? caseDesc, string? requester);
	Task<List<EventTypesResult>> GetEventTypes();
	Task<List<CaseTypesResult>> GetCaseTypes();
	Task<List<EventCategoriesResult>> GetEventCategories();
	Task<List<EventSubTypesResult>> GetEventSubTypes();
	Task<List<TaskStatusesResult>> GetTaskStatuses();
	//Bobby
	Task<List<SiteHandlersResult>> GetSiteHandlers();
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

	Task<List<CaseTaskResult>> GetCaseTaskByCaseId(int caseid);
	Task<List<CaseMediaResult>> GetCaseMediaByCaseId(int caseid);
	//bobby
	Task<CaseCreateTaskResult> PostCaseCreateTasks(string name, int caseid, int statuscode, int iscritical, string taskcategoryid);
	Task<CaseUpdateTaskResult> UpdateTaskById(int id, string name, int caseid, int statuscode, int taskcategoryId, bool iscritical, int? assignedStaffId, string? assignedStaffDisplayName, string? createdBy, string? createdOn, int? sequence);
	Task<List<CaseResult>> GetCases();
	Task<List<CasesUpdatesResult>> GetCasesUpdates(string? fromDate, string? toDate, string? countData, string? skipData);
	Task<CreateMediaResult> CreateMedia(int caseId, IFormFile media);
	Task<List<CreateCWOWithCaseLinkResult>> CreateCWOWithCaseLink(CreateCWOWithCaseLinkCommand data);
	Task<UpdateCaseStatusResult> UpdateCaseStatus(UpdateCaseStatusCommand data);
}
