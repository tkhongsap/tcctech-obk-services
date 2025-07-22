using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseList;
public class GetCaseListQueryHandler : IQueryHandler<GetCaseListQuery, GetCaseListResult>
{
	
	IUnitOfWork _uow;
	public GetCaseListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetCaseListResult> Handle(GetCaseListQuery request, CancellationToken cancellationToken)
	{
		var cases = await _uow.CasesRepository.GetAll(request.CaseId, request.Filter, request.CaseIds, null, true, request, request.AssignedStaffId);
		//var totalCount = await _uow.CasesRepository.GetAllCount(request.CaseId, request.Filter, request.CaseIds, null, true, request.AssignedStaffId);
		var countStatusOpen = 0;
		var countStatusInprogress = 0;
		var countStatusComplete = 0;

		var listCasesFirst = new List<GetCaseResultData>();
		var listCases = new List<GetCaseResultData>();
		var listCasesAll = new List<GetCaseResultData>();
		foreach (var item in cases)
		{
			var locationFullname = await _uow.LocationRepository.GetLocationFullnamebyRefId(item.LocationId);
			GetCaseResultData result = new GetCaseResultData();
			result.Id = item.Id;
			result.ShortDesc = item.ShortDesc;
			result.CaseNo = item.CaseNo;
			result.EventTypeId = item.EventTypeId;
			result.EventTypeCode = item.EventTypeCode;
			result.LocationId = item.LocationId;
			result.LocationCode = item.LocationCode;
			result.LocationName = item.LocationName;
			result.LocationFullname = locationFullname;
			result.PriorityLevelId = item.PriorityLevelId;
			result.SiteHandler = item.SiteHandler;
			result.StatusCode = item.StatusCode;
			result.Timestamp = item.Timestamp;
			result.CreatedOn = item.CreatedOn;
			result.SlaConfigId = item.SlaConfigId;
			result.CaseTypeId = item.CaseTypeId;
			result.CreatedBy = item.CreatedBy;
			result.SlaFailed = item.SlaFailed;
			result.SlaDate = item.SlaDate;
			result.Description = item.Description;
			result.EquipmentTag = item.EquipmentTag;
			result.ExternalRefNo = item.ExternalRefNo;
			result.IsCritical = item.IsCritical;
			result.PriorityText = item.PriorityText;
			result.SyncStatus = item.SyncStatus;
			result.SyncUtcTs = item.SyncUtcTs;
			var listTasks = new List<GetCaseTaskResult>();
			for (int i = 0; i < item.trCaseTasks.Count; i++){
				if (request.AssignedStaffId != null && request.AssignedStaffId != item.trCaseTasks[i].AssignedStaffId) continue;
				if (item.trCaseTasks[i].StatusCode == 1) {
					countStatusOpen += 1;
				} else if (item.trCaseTasks[i].StatusCode == 2) {
					countStatusInprogress += 1;
				} else if (item.trCaseTasks[i].StatusCode == 4) {
					countStatusComplete += 1;
				}
				if (request.StatusCode != null && request.StatusCode != item.trCaseTasks[i].StatusCode) continue;
				listTasks.Add(new GetCaseTaskResult
				{
					Id = item.trCaseTasks[i].Id,
					Name = item.trCaseTasks[i].Name,
					CaseId = item.trCaseTasks[i].CaseId,
					StatusCode = item.trCaseTasks[i].StatusCode,
					Sequence = item.trCaseTasks[i].Sequence,
					CreatedBy = item.trCaseTasks[i].CreatedBy,
					CreatedOn = item.trCaseTasks[i].CreatedOn,
					ModifiedBy = item.trCaseTasks[i].ModifiedBy,
					ModifiedOn = item.trCaseTasks[i].ModifiedOn,
					IsCritical = item.trCaseTasks[i].IsCritical,
					TaskCategoryId = item.trCaseTasks[i].TaskCategoryId,
					AssignedStaffId = item.trCaseTasks[i].AssignedStaffId,
				    AssignedStaffDisplayName = item.trCaseTasks[i].AssignedStaffDisplayName,
				});
			}
			if (listTasks.Count == 0) continue;
			listTasks = listTasks.OrderBy(x => x.Sequence).ToList();
			result.TrCaseTasks = listTasks;
			if (item.PriorityLevelId == 1) {
				listCasesFirst.Add(result);
			} else {
				listCases.Add(result);
			}
		}
		
		listCasesAll.AddRange(listCasesFirst);
		listCasesAll.AddRange(listCases);

		var statusData = new StatusData()
		{
			Open = countStatusOpen,
			Inprogress = countStatusInprogress,
			Complete = countStatusComplete
		};

		return new GetCaseListResult(listCasesAll, statusData);
	}
}
