using System.Collections.Generic;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCase;
public class GetCaseQueryHandler : IQueryHandler<GetCaseQuery, GetCaseResult>
{
	IUnitOfWork _uow;
	public GetCaseQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetCaseResult> Handle(GetCaseQuery request, CancellationToken cancellationToken)
	{
		var data = await _uow.CasesRepository.GetById(request.CID, request.Scope);
		GetCaseResult result = new GetCaseResult();
		result.Id = data.Id;
		result.ShortDesc = data.ShortDesc;
		result.CaseNo = data.CaseNo;
		result.EventTypeId = data.EventTypeId;
		result.EventTypeCode = data.EventTypeCode;
		result.LocationId = data.LocationId;
		result.LocationCode = data.LocationCode;
		result.LocationName = data.LocationName;
		result.PriorityLevelId = data.PriorityLevelId;
		result.SiteHandler = data.SiteHandler;
		result.StatusCode = data.StatusCode;
		result.Timestamp = data.Timestamp;
		result.CreatedOn = data.CreatedOn;
		result.SlaConfigId = data.SlaConfigId;
		result.CaseTypeId = data.CaseTypeId;
		result.CreatedBy = data.CreatedBy;
		result.SlaFailed = data.SlaFailed;
		result.SlaDate = data.SlaDate;
		result.Description = data.Description;
		result.EquipmentTag = data.EquipmentTag;
		result.ExternalRefNo = data.ExternalRefNo;
		result.IsCritical = data.IsCritical;
		result.PriorityText = data.PriorityText;
		result.SyncStatus = data.SyncStatus;
		result.SyncUtcTs = data.SyncUtcTs;
		// var listMedias = new List<GetCaseMediaResult>();
		// for (int i = 0; i < data.trCaseMedias.Count; i++){
		// 	listMedias.Add(new GetCaseMediaResult
		// 	{
		// 		Id = data.trCaseMedias[i].Id,
		// 		CaseId = data.trCaseMedias[i].CaseId,
		// 		FileName = data.trCaseMedias[i].FileName,
		// 		Data = data.trCaseMedias[i].Data,
		// 		MimeType = data.trCaseMedias[i].MimeType,
		// 	});
		// }
		// result.TrCaseMedias = listMedias;
		var listTasks = new List<GetCaseTaskResult>();
		for (int i = 0; i < data.trCaseTasks.Count; i++){
			listTasks.Add(new GetCaseTaskResult
			{
				Id = data.trCaseTasks[i].Id,
				Name = data.trCaseTasks[i].Name,
				CaseId = data.trCaseTasks[i].CaseId,
				StatusCode = data.trCaseTasks[i].StatusCode,
				Sequence = data.trCaseTasks[i].Sequence,
				CreatedBy = data.trCaseTasks[i].CreatedBy,
				CreatedOn = data.trCaseTasks[i].CreatedOn,
				ModifiedBy = data.trCaseTasks[i].ModifiedBy,
				ModifiedOn = data.trCaseTasks[i].ModifiedOn,
				IsCritical = data.trCaseTasks[i].IsCritical,
				TaskCategoryId = data.trCaseTasks[i].TaskCategoryId,
				AssignedStaffId = data.trCaseTasks[i].AssignedStaffId,
				AssignedStaffDisplayName = data.trCaseTasks[i].AssignedStaffDisplayName,
			});
		}
		result.TrCaseTasks = listTasks;
		return result;
	}
}
