using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseTasks;
public class GetCaseTasksQueryHandler : IQueryHandler<GetCaseTasksQuery, GetCaseTasksResult>
{
	
	IUnitOfWork _uow;
	public GetCaseTasksQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetCaseTasksResult> Handle(GetCaseTasksQuery request, CancellationToken cancellationToken)
	{
		var caseTasks = await _uow.CaseTasksRepository.GetById(request.CaseId, true);
		var locationFullname = await _uow.LocationRepository.GetLocationFullnamebyRefId(caseTasks.trCases.LocationId);
		GetCaseData resultCase = new GetCaseData();
		resultCase.Id = caseTasks.trCases.Id;
		resultCase.ShortDesc = caseTasks.trCases.ShortDesc;
		resultCase.CaseNo = caseTasks.trCases.CaseNo;
		resultCase.EventTypeId = caseTasks.trCases.EventTypeId;
		resultCase.EventTypeCode = caseTasks.trCases.EventTypeCode;
		resultCase.LocationId = caseTasks.trCases.LocationId;
		resultCase.LocationCode = caseTasks.trCases.LocationCode;
		resultCase.LocationName = caseTasks.trCases.LocationName;
		resultCase.LocationFullname = locationFullname;
		resultCase.PriorityLevelId = caseTasks.trCases.PriorityLevelId;
		resultCase.SiteHandler = caseTasks.trCases.SiteHandler;
		resultCase.StatusCode = caseTasks.trCases.StatusCode;
		resultCase.Timestamp = caseTasks.trCases.Timestamp;
		resultCase.CreatedOn = caseTasks.trCases.CreatedOn;
		resultCase.SlaConfigId = caseTasks.trCases.SlaConfigId;
		resultCase.CaseTypeId = caseTasks.trCases.CaseTypeId;
		resultCase.CreatedBy = caseTasks.trCases.CreatedBy;
		resultCase.SlaFailed = caseTasks.trCases.SlaFailed;
		resultCase.SlaDate = caseTasks.trCases.SlaDate;
		resultCase.Description = caseTasks.trCases.Description;
		resultCase.EquipmentTag = caseTasks.trCases.EquipmentTag;
		resultCase.ExternalRefNo = caseTasks.trCases.ExternalRefNo;
		resultCase.IsCritical = caseTasks.trCases.IsCritical;
		resultCase.PriorityText = caseTasks.trCases.PriorityText;
		resultCase.SyncStatus = caseTasks.trCases.SyncStatus;
		resultCase.SyncUtcTs = caseTasks.trCases.SyncUtcTs;
		
		// var listMedias = new List<GetCaseMediaResult>();
		// for (int i = 0; i < caseTasks.trCases.trCaseMedias.Count; i++){
		// 	listMedias.Add(new GetCaseMediaResult
		// 	{
		// 		Id = caseTasks.trCases.trCaseMedias[i].Id,
		// 		CaseId = caseTasks.trCases.trCaseMedias[i].CaseId,
		// 		FileName = caseTasks.trCases.trCaseMedias[i].FileName,
		// 		Data = caseTasks.trCases.trCaseMedias[i].Data,
		// 		MimeType = caseTasks.trCases.trCaseMedias[i].MimeType,
		// 	});
		// }
		// resultCase.TrCaseMedias = listMedias;

		GetCaseTasksResult result = new GetCaseTasksResult();
		result.Id = caseTasks.Id;
		result.Name = caseTasks.Name;
		result.CaseId = caseTasks.CaseId;
		result.StatusCode = caseTasks.StatusCode;
		result.Sequence = caseTasks.Sequence;
		result.CreatedBy = caseTasks.CreatedBy;
		result.CreatedOn = caseTasks.CreatedOn;
		result.ModifiedBy = caseTasks.ModifiedBy;
		result.ModifiedOn = caseTasks.ModifiedOn;
		result.IsCritical = caseTasks.IsCritical;
		result.TaskCategoryId = caseTasks.TaskCategoryId;
		result.AssignedStaffId = caseTasks.AssignedStaffId;
		result.AssignedStaffDisplayName = caseTasks.AssignedStaffDisplayName;

		result.Case = resultCase;

		return result;
	}
}
