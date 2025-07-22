using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CasesRepository;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTask;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UpsertCases;

internal class UpsertCasesHandler : IRequestHandler<UpsertCasesCommand, UpsertCasesResult>
{
	IUnitOfWork _uow;
	private readonly IAbstractionService _apiService;
	private readonly IMediator _mediator;
	public UpsertCasesHandler(IUnitOfWork uow, IAbstractionService apiService, IMediator mediator)
	{
		_uow = uow;
		_apiService = apiService;
		_mediator = mediator;
	}
	public async Task<UpsertCasesResult> Handle(UpsertCasesCommand request, CancellationToken cancellationToken)
	{
		var cases = new List<trCases>();
		List<int> idList = new List<int>();
		if (request.Status != null)
		{
			if (request.Skip < 0) throw new ArgumentNullException(nameof(request.Skip));
			if (request.Take < 0) throw new ArgumentNullException(nameof(request.Take));
			cases = await _uow.CasesRepository.GetAll(null, null, null, request.Status, true, request, null);
			idList = cases.Select(x => x.Id).ToList();
		}
		else if (request.CaseIdList != null)
		{
			idList = request.CaseIdList;
		}
		else
		{
			DateTime? dateCheck = DateTime.Now.ToUniversalTime().AddHours(7);
			DateTime? dateCheckEnd = null;
			string? syncDateTimeEnd = null;
			if (request.StartDate != null)
			{
				dateCheck = request.StartDate;
			}
			if (request.EndDate != null)
			{
				dateCheckEnd = request.EndDate;
				syncDateTimeEnd = dateCheckEnd.Value.ToString("yyyy-MM-dd HH:mm:ss");
			}
			string syncDateTime = dateCheck.Value.AddMinutes(-request.LastMinute).ToString("yyyy-MM-dd HH:mm:ss");

			var caseData = await _apiService.CertisTransaction.GetCaseIndidentUpdatesList(syncDateTime, syncDateTimeEnd);
			for (int i = 0; i < caseData.Count; i++)
			{
				idList.Add(caseData[i].Id);
				UpsertCasesModel requestCase = new UpsertCasesModel
				{
					Id = caseData[i].Id,
					ShortDesc = caseData[i].ShortDesc,
					CaseNo = caseData[i].CaseNo,
					EventTypeId = caseData[i].EventTypeId,
					EventTypeCode = caseData[i].EventTypeCode,
					LocationId = caseData[i].LocationId,
					LocationCode = caseData[i].LocationCode,
					LocationName = caseData[i].LocationName,
					PriorityLevelId = caseData[i].PriorityLevelId,
					SlaConfigId = caseData[i].SlaConfigId,
					CaseTypeId = caseData[i].CaseTypeId,
					SiteHandler = caseData[i].SiteHandler,
					StatusCode = caseData[i].StatusCode,
					Timestamp = caseData[i].Timestamp.ToString(),
					CreatedOn = caseData[i].CreatedOn,
					CreatedBy = caseData[i].CreatedBy,
					SlaFailed = caseData[i].SlaFailed,
					SlaDate = caseData[i].SlaDate,
					Description = caseData[i].Description,
					EquipmentTag = caseData[i].EquipmentTag,
					ExternalRefNo = caseData[i].ExternalRefNo,
					IsCritical = caseData[i].IsCritical,
					ModifiedBy = caseData[i].ModifiedBy,
					ModifiedOn = caseData[i].ModifiedOn,
					Requester = caseData[i].Requester
				};
				await _uow.CasesRepository.UpsertCases(requestCase);
			}
		}
		foreach (var caseId in idList)
		{
			var taskData = await _apiService.CertisTransaction.GetCaseIndidentTasks(caseId);
			//await _uow.CaseMediasRepository.RemoveCaseMedias(caseId);
			var caseTaskData = await _uow.CaseTasksRepository.GetAll(null, null, null, null, false, request, null, null, null, null, caseId);
			List<int> taskIdListDB = new List<int>();
			Dictionary<int, trCaseTasks> taskDict = new Dictionary<int, trCaseTasks>();
			for (int i = 0; i < caseTaskData.Count; i++)
			{
				taskIdListDB.Add(caseTaskData[i].Id);
				taskDict.Add(caseTaskData[i].Id, caseTaskData[i]);
			}
			List<int> taskIdList = new List<int>();
			for (int i = 0; i < taskData.Count; i++)
			{
				if (taskDict.ContainsKey(taskData[i].Id))
				{
					taskIdList.Add(taskData[i].Id);
					await _uow.CaseTasksRepository.UpdateCaseTasks(taskData[i]);

					//noti here
					if (taskData[i].AssignedStaffId != null && taskDict[taskData[i].Id].AssignedStaffId != taskData[i].AssignedStaffId)
					{
						try
						{
							var appconfig = Constant.TASK_INCIDENT_ASSIGN;

							var messagetemplate = await _mediator.Send(new GetAppConfigByNameQuery(appconfig));
							var messagetemplaten = await _mediator.Send(new GetAppConfigByNameQuery(appconfig + "_EN"));

							var socuser = await _uow.MemberRepository.GetByStaffId(taskData[i].AssignedStaffId.Value, true);
							messagetemplate = messagetemplate;
							messagetemplaten = messagetemplaten;
							var socusername = socuser.FirstName + socuser;
							var sendnoti = new SendFCMNotiCommand()
							{
								Message = messagetemplate,
								MessageEn = messagetemplaten,
								FromUser = Constant.TENANT_OPERATION_APP_ID,
								ToUser = socuser.MID,
								FromUserName = socuser.FirstName,
								ToUserName = socusername ?? "",
								NotificationType = Constant.INCIDENT_MESSAGE_TYPE,
								workId = taskData[i].Id,
							};
							await _mediator.Send(sendnoti);
						}
						catch
						{
							continue;
						}
					}
				}
				else
				{
					await _uow.CaseTasksRepository.CreateCaseTasks(taskData[i]);
					//noti here for create 
					if (taskData[i].AssignedStaffId != null)
					{
						try
						{
							var appconfig = Constant.TASK_INCIDENT_ASSIGN;

							var messagetemplate = await _mediator.Send(new GetAppConfigByNameQuery(appconfig));
							var messagetemplaten = await _mediator.Send(new GetAppConfigByNameQuery(appconfig + "_EN"));

							var socuser = await _uow.MemberRepository.GetByStaffId(taskData[i].AssignedStaffId.Value, true);
							messagetemplate = messagetemplate;
							messagetemplaten = messagetemplaten;
							var socusername = socuser.FirstName + socuser;
							var sendnoti = new SendFCMNotiCommand()
							{
								Message = messagetemplate,
								MessageEn = messagetemplaten,
								FromUser = Constant.TENANT_OPERATION_APP_ID,
								ToUser = socuser.MID,
								FromUserName = socuser.FirstName,
								ToUserName = socusername ?? "",
								NotificationType = Constant.INCIDENT_MESSAGE_TYPE,
								workId = taskData[i].Id
							};
							await _mediator.Send(sendnoti);
						}
						catch
						{
							continue;
						}
					}
				}
			}

			if (taskIdList.Count > 0)
			{
				List<int> taskIdRemoveList = new List<int>();
				for (int i = 0; i < taskIdListDB.Count; i++)
				{
					if (!taskIdList.Contains(taskIdListDB[i]))
					{
						taskIdRemoveList.Add(taskIdListDB[i]);
					}
				}
				if (taskIdRemoveList.Count > 0)
				{
					await _uow.CaseTasksRepository.RemoveCaseTasksByIds(taskIdRemoveList);
				}
			}

			// var mediaData = await _apiService.CertisTransaction.GetCaseIndidentMedias(caseId);
			// for (int i = 0; i < mediaData.Count; i++)
			// {
			// 	await _uow.CaseMediasRepository.CreateCaseMedias(mediaData[i]);
			// }
		}

		if (idList.Count() > 0)
		{
			await _uow.CasesRepository.UpdateSyncStatus(idList, 1);
		}
		await _uow.SaveChangeAsyncWithCommit();
		return new UpsertCasesResult() { Count = idList.Count() };
	}
}