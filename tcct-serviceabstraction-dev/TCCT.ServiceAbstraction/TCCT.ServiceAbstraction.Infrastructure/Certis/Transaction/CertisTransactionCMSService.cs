using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
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

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public class CertisTransactionCMSService : ICertisTransactionCMSService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionCMSService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}
	public Task<CasesResult> CreateCases(string shortDesc, string? equipmentTag, int locationId, int eventTypeId, int? caseTypeId, string? caseDesc, string? requester)
	{
		return _endpointprovider.CreateCases(shortDesc, equipmentTag, locationId, eventTypeId, caseTypeId, caseDesc, requester);
	}

	public Task<List<CaseTypesResult>> GetCaseTypes()
	{
		return _endpointprovider.GetCaseTypes();
	}

	public Task<List<EventCategoriesResult>> GetEventCategories()
	{
		return _endpointprovider.GetEventCategories();
	}

	public Task<List<EventSubTypesResult>> GetEventSubTypes()
	{
		return _endpointprovider.GetEventSubTypes();
	}

	public Task<List<EventTypesResult>> GetEventTypes()
	{
		return _endpointprovider.GetEventTypes();
	}

	public Task<List<TaskStatusesResult>> GetTaskStatuses()
	{
		return _endpointprovider.GetTaskStatuses();
	}
	//Bobby
	public Task<List<SiteHandlersResult>> GetSiteHandlers()
	{
		return _endpointprovider.GetSiteHandlers();
	}

	public Task<List<SlaConfigsResult>> GetSlaConfigs()
	{
		return _endpointprovider.GetSlaConfigs();
	}
	public Task<List<CaseLocationsResult>> GetCaseLocations()
	{
		return _endpointprovider.GetCaseLocations();
	}
	//Bobby
	public Task<List<CaseAssetCategoriesResult>> GetCaseAssetCategories()
	{
		return _endpointprovider.GetCaseAssetCategories();
	}

	public Task<GetCaseByIdResult> GetCaseById(int id)
	{
		return _endpointprovider.GetCaseById(id);
	}

	public Task<GetCaseTaskByTaskIdResult> GetCaseTaskByTaskId(int caseid, int taskid)
	{
		return _endpointprovider.GetCaseTaskByTaskId(caseid, taskid);
	}

	public Task<List<CaseStatusResult>> GetCaseStatus()
	{
		return _endpointprovider.GetCaseStatus();
	}

	public Task<List<TaskCategoryResult>> GetTaskCategory()
	{
		return _endpointprovider.GetTaskCategory();
	}

	public Task<List<PriorityLevelResult>> GetPriorityLevel()
	{
		return _endpointprovider.GetPriorityLevel();
	}
	public Task<List<IconResult>> GetIcons()
	{
		return _endpointprovider.GetIcons();
	}

	public Task<List<CaseTaskResult>> GetCaseTaskByCaseId(int caseid)
	{
		return _endpointprovider.GetCaseTaskByCaseId(caseid);
	}

	public Task<List<CaseMediaResult>> GetCaseMediaByCaseId(int caseid)
	{
		return _endpointprovider.GetCaseMediaByCaseId(caseid);
	}

	public Task<List<CaseLocationTypeResult>> GetCaseLocationTypes()
	{
		return _endpointprovider.GetCaseLocationTypes();
	}

	public Task<List<CaseAssetResult>> GetCaseAssets()
	{
		return _endpointprovider.GetCaseAssets();
	}
	public Task<CaseCreateTaskResult> PostCaseCreateTasks(string name, int caseid, int statuscode, int iscritical, string taskcategoryid)
	{
		return _endpointprovider.PostCaseCreateTasks(name, caseid, statuscode, iscritical, taskcategoryid);
	}

	public Task<CaseUpdateTaskResult> UpdateTaskById(int id, string name, int caseid, int statuscode, int taskcategoryId, bool iscritical, int? assignedStaffId, string? assignedStaffDisplayName, string? createdBy, string? createdOn, int? sequence)
	{
		return _endpointprovider.UpdateTaskById(id, name, caseid, statuscode, taskcategoryId, iscritical, assignedStaffId, assignedStaffDisplayName, createdBy, createdOn, sequence);
	}

	public Task<List<CaseResult>> GetCases()
	{
		return _endpointprovider.GetCases();
	}

	public Task<List<CasesUpdatesResult>> GetCasesUpdates(string? fromDate, string? toDate, string? countData, string? skipData)
	{
		return _endpointprovider.GetCasesUpdates(fromDate, toDate, countData, skipData);
	}

	public Task<CreateMediaResult> CreateMedia(int caseId, IFormFile media)
	{
		return _endpointprovider.CreateMedia(caseId, media);
	}

	public Task<List<CreateCWOWithCaseLinkResult>> CreateCWOWithCaseLink(CreateCWOWithCaseLinkCommand data)
	{
		return _endpointprovider.CreateCWOWithCaseLink(data);
	}

	public Task<UpdateCaseStatusResult> UpdateCaseStatus(UpdateCaseStatusCommand data)
	{
		return _endpointprovider.UpdateCaseStatus(data);
	}
}
