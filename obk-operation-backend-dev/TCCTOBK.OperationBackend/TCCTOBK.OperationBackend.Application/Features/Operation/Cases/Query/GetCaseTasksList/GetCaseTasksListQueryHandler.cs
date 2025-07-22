using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseTasksList;
public class GetCaseTasksListQueryHandler : IQueryHandler<GetCaseTasksListQuery, GetCaseTasksListResult>
{

	IUnitOfWork _uow;
	public GetCaseTasksListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetCaseTasksListResult> Handle(GetCaseTasksListQuery request, CancellationToken cancellationToken)
	{
		var caseTasks = await _uow.CaseTasksRepository.GetAll(request.CaseTaskId, request.Filter, request.CaseTaskIds, request.StatusCode, true, request, request.AssignedStaffId, request.LocationId, request.PriorityLevelId, request.CaseStatusCode, null);
		var totalCount = await _uow.CaseTasksRepository.GetAllCount(request.CaseTaskId, request.Filter, request.CaseTaskIds, request.StatusCode, true, request.AssignedStaffId, request.LocationId, request.PriorityLevelId, request.CaseStatusCode, null);
		var listCaseTasks = new List<GetCaseTasksListData>();
		foreach (var item in caseTasks)
		{
			var locationFullname = await _uow.LocationRepository.GetLocationFullnamebyRefId(item.trCases.LocationId);
			GetCase resultCase = new GetCase();
			resultCase.Id = item.trCases.Id;
			resultCase.ShortDesc = item.trCases.ShortDesc;
			resultCase.CaseNo = item.trCases.CaseNo;
			resultCase.EventTypeId = item.trCases.EventTypeId;
			resultCase.EventTypeCode = item.trCases.EventTypeCode;
			resultCase.LocationId = item.trCases.LocationId;
			resultCase.LocationCode = item.trCases.LocationCode;
			resultCase.LocationName = item.trCases.LocationName;
			resultCase.LocationFullname = locationFullname;
			resultCase.PriorityLevelId = item.trCases.PriorityLevelId;
			resultCase.SiteHandler = item.trCases.SiteHandler;
			resultCase.StatusCode = item.trCases.StatusCode;
			resultCase.Timestamp = item.trCases.Timestamp;
			resultCase.CreatedOn = item.trCases.CreatedOn;
			resultCase.SlaConfigId = item.trCases.SlaConfigId;
			resultCase.CaseTypeId = item.trCases.CaseTypeId;
			resultCase.CreatedBy = item.trCases.CreatedBy;
			resultCase.SlaFailed = item.trCases.SlaFailed;
			resultCase.SlaDate = item.trCases.SlaDate;
			resultCase.Description = item.trCases.Description;
			resultCase.EquipmentTag = item.trCases.EquipmentTag;
			resultCase.ExternalRefNo = item.trCases.ExternalRefNo;
			resultCase.IsCritical = item.trCases.IsCritical;
			resultCase.PriorityText = item.trCases.PriorityText;
			resultCase.SyncStatus = item.trCases.SyncStatus;
			resultCase.SyncUtcTs = item.trCases.SyncUtcTs;


			GetCaseTasksListData result = new GetCaseTasksListData();
			result.Id = item.Id;
			result.Name = item.Name;
			result.CaseId = item.CaseId;
			result.StatusCode = item.StatusCode;
			result.Sequence = item.Sequence;
			result.CreatedBy = item.CreatedBy;
			result.CreatedOn = item.CreatedOn;
			result.ModifiedBy = item.ModifiedBy;
			result.ModifiedOn = item.ModifiedOn;
			result.IsCritical = item.IsCritical;
			result.TaskCategoryId = item.TaskCategoryId;
			result.AssignedStaffId = item.AssignedStaffId;
			result.AssignedStaffDisplayName = item.AssignedStaffDisplayName;
			result.Case = resultCase;
			listCaseTasks.Add(result);
		}

		var paginate = new Paginate()
		{
			Count = caseTasks.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		var statusData = new StatusData()
		{
			Open = listCaseTasks.Count(x => x.StatusCode == 1),
			Inprogress = listCaseTasks.Count(x => x.StatusCode == 2),
			Complete = listCaseTasks.Count(x => x.StatusCode == 4)
		};
		listCaseTasks = listCaseTasks.OrderByDescending(x => x.CreatedOn).OrderBy(x => x.Case.PriorityLevelId).ToList();
		return new GetCaseTasksListResult(paginate, listCaseTasks, statusData);
	}
}
