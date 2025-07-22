using System.Diagnostics;
using Amazon.SimpleEmail.Model;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.MasterUser;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.PPM.Command.UpsertPPM;

internal class UpsertPPMHandler : IRequestHandler<UpsertPPMCommand, UpsertPPMResult>
{
	IUnitOfWork _uow;
	private readonly IAbstractionService _apiService;
	private readonly IMediator _mediator;
	public UpsertPPMHandler(IUnitOfWork uow, IAbstractionService apiService, IMediator mediator)
	{
		_uow = uow;
		_apiService = apiService;
		_mediator = mediator;
	}
	public async Task<UpsertPPMResult> Handle(UpsertPPMCommand request, CancellationToken cancellationToken)
	{
		List<int> idList = new List<int>();
		DateTime? dateCheck = DateTime.Now.ToUniversalTime().AddHours(7);
		string? syncDateTimeEnd = null;
		if (request.StartDate != null)
		{
			dateCheck = request.StartDate;
		}
		if (request.EndDate != null)
		{
			syncDateTimeEnd = request.EndDate.Value.ToString("yyyy-MM-dd HH:mm:ss");
		}
		string syncDateTime = dateCheck.Value.AddMinutes(-request.LastMinute).ToString("yyyy-MM-dd HH:mm:ss");


		var ppmData = await _apiService.CertisTransaction.GetPPMUpdatesList(syncDateTime, syncDateTimeEnd);
		for (int i = 0; i < ppmData.Count; i++)
		{
			idList.Add(ppmData[i].Id!.Value);
			//PPM Notification
			//check status from db
			var ppmlastsyncdata = await _uow.PPMRepository.GetById(ppmData[i].Id!.Value, false, null, false);
			if (!request.IsFirstSync && (ppmlastsyncdata == null || ppmlastsyncdata.StatusId != ppmData[i].StatusId))
			{
				try
				{
					if (ppmData[i].StatusId != null && request.MessageTemplate == null)
					{
						await PPMNotification(ppmData[i].StatusId.Value, ppmData[i].SupervisorId, ppmData[i].TechniciansAssignedBy, ppmData[i].Id.Value, ppmData[i].Name, ppmlastsyncdata?.StatusId);
					}
					else if (request.PPMId != ppmData[i].Id && request.PPMId != null && request.MessageTemplate != null)
					{
						await PPMNotification(ppmData[i].StatusId.Value, ppmData[i].SupervisorId, ppmData[i].TechniciansAssignedBy, ppmData[i].Id.Value, ppmData[i].Name, ppmlastsyncdata?.StatusId);
					}
				}
				catch (Exception ex)
				{
				}
			}
			await _uow.PPMRepository.UpsertPPM(ppmData[i]);
			await _uow.SaveChangeAsyncWithCommit();
		}
		try
		{
			if (request.MessageTemplate != null && request.PPMId != null)
			{
				await UpdatePPMSendNotification(request.PPMId.Value, request.MessageTemplate, request.SendFrom.Value, request.SendTo.Value);
			}
		}
		catch { }


		return new UpsertPPMResult() { Count = idList.Count() };
	}
	private async Task PPMNotification(int status, string? supervisorEmail, string? technicianEmail, int ppmId, string ppmNumber, int? formStatus)
	{

		var templateKey = status switch
		{
			2 => Constant.PPM_MOZART_ASSIGN,
			3 => Constant.PPM_ASSIGN,
			4 => Constant.PPM_ACK,
			5 => Constant.PPM_COMPLETE,
			6 => Constant.PPM_CLOSE,
			// 7 => Constant.PPM_CLIENT_VERIFIED,
			// 8 => Constant.PPM_CANCLE,
			_ => null
		};

		if (templateKey == null) return;

		var templateMessage = await _uow.AppConfigRepository.GetValueByName(templateKey);
		var templateMessageEn = await _uow.AppConfigRepository.GetValueByName(templateKey + "_EN");


		var replacements = new Dictionary<string, string>
				{
						{ "<<ppmname>>", ppmNumber },
						{ "<<name>>", "Mozart" },
						{ "<<fromstatus>>", GetFromStatus(status) },
						{ "<<tostatus>>", GetToStatus(status) }
				};

		foreach (var (key, value) in replacements)
		{
			templateMessage = templateMessage.Replace(key, value);
			templateMessageEn = templateMessageEn.Replace(key, GetEnglishEquivalent(value));
		}

		if (formStatus != null)
		{
			if (status == 3 && formStatus == 5)
			{

				await SendNotification(supervisorEmail, $"{ppmNumber} ต้องดำเนินการแก้ไขงานใหม่", $"{ppmNumber} requires rework", ppmId);
				await SendNotification(technicianEmail, $"{ppmNumber} ต้องดำเนินการแก้ไขงานใหม่", $"{ppmNumber} requires rework", ppmId);
			}
			else if (status == 2 && formStatus == 3)
			{

				await SendNotification(supervisorEmail, $"{ppmNumber} ถูกปฏิเสธ", $"{ppmNumber} has been REJECTED", ppmId);
			}
			else
			{
				await SendNotification(supervisorEmail, templateMessage, templateMessageEn, ppmId);
				await SendNotification(technicianEmail, templateMessage, templateMessageEn, ppmId);
			}
		}
		else
		{
			await SendNotification(supervisorEmail, templateMessage, templateMessageEn, ppmId);
			await SendNotification(technicianEmail, templateMessage, templateMessageEn, ppmId);
		}

	}

	private string GetFromStatus(int status) => status switch
	{
		4 => "มอบหมาย",
		5 => "กำลังดำเนินการ",
		6 => "สำเร็จ",
		_ => ""
	};

	private string GetToStatus(int status) => status switch
	{
		4 => "กำลังดำเนินการ",
		5 => "สำเร็จ",
		6 => "ปิดงาน",
		_ => ""
	};

	private string GetEnglishEquivalent(string status) => status switch
	{
		"มอบหมาย" => "ASSIGN",
		"กำลังดำเนินการ" => "IN PROGRESS",
		"สำเร็จ" => "COMPLETE",
		"ปิดงาน" => "CLOSE",
		_ => status
	};

	private async Task SendNotification(string? email, string message, string messageEn, int ppmId)
	{
		if (string.IsNullOrEmpty(email)) return;
		var data = await _apiService.MasterData.GetMasterUsers();
		var usermozart = data.FirstOrDefault(x => x.Id == Guid.Parse(email));
		if (usermozart == null) return;
		var user = await _uow.MemberRepository.GetByEmail(usermozart.Email, true);
		if (user == null) return;

		var sendNoti = new SendFCMNotiCommand
		{
			Message = message,
			MessageEn = messageEn,
			FromUser = Constant.MOZART_GUID,
			ToUser = user.MID,
			FromUserName = "Mozart",
			ToUserName = usermozart.Username ?? "",
			NotificationType = Constant.PPM_MESSAGE_TYPE,
			workId = ppmId
		};

		await _mediator.Send(sendNoti);
	}

	private Task<(string, string)> ReplaceTemplate(string template, string templateen, string ppmNumber, int ppmStatus, string toUsername)
	{
		var templateMessage = template;
		var templateMessageEn = templateen;

		var replacements = new Dictionary<string, string>
		{
				{ "<<ppmname>>", ppmNumber },
				{ "<<name>>", toUsername },
				{ "<<fromstatus>>", GetFromStatus(ppmStatus) },
				{ "<<tostatus>>", GetToStatus(ppmStatus) },
		};

		foreach (var (key, value) in replacements)
		{
			templateMessage = templateMessage.Replace(key, value);
			templateMessageEn = templateMessageEn.Replace(key, GetEnglishEquivalent(value));
		}

		return Task.FromResult((templateMessage, templateMessageEn));
	}
	private async Task UpdatePPMSendNotification(int ppmid, string appconfig, Guid sendForm, Guid sendTo)
	{
		var messagetemplate = await _mediator.Send(new GetAppConfigByNameQuery(appconfig));
		var messagetemplaten = await _mediator.Send(new GetAppConfigByNameQuery(appconfig + "_EN"));
		var user = await _mediator.Send(new MasterUserQuery(sendForm, sendTo));
		var fuser = Guid.Empty;
		var tuser = Guid.Empty;
		var fusername = "";
		var tusername = "";
		var ppmdetail = await _mediator.Send(new PPMDetailQuery(ppmid));

		if (user.FromUser != null)
		{
			fuser = user.FromUser.Value;
			fusername = user.FromUserName;
		}
		if (user.ToUser != null)
		{
			tuser = user.ToUser.Value;
			tusername = user.ToUserName;
		}
		var (template, templateEn) = await ReplaceTemplate(messagetemplate, messagetemplaten, ppmdetail.MasterWorkTitle, ppmdetail.Status.Value, fusername);

		var sendnoti = new SendFCMNotiCommand()
		{
			Message = template,
			MessageEn = templateEn,
			FromUser = fuser,
			ToUser = tuser,
			FromUserName = user.FromUserName ?? "",
			ToUserName = user.ToUserName ?? "",
			NotificationType = Constant.PPM_MESSAGE_TYPE,
			workId = ppmdetail.PPMID
		};
		await _mediator.Send(sendnoti);
	}
}