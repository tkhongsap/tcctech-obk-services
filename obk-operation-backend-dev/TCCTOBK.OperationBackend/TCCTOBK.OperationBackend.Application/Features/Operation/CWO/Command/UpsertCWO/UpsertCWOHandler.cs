using System.Diagnostics;
using Amazon.SimpleEmail.Model;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.CWORepository;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.MasterUser;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.CWO.Command.UpsertCWO;

internal class UpsertCWOHandler : IRequestHandler<UpsertCWOCommand, UpsertCWOResult>
{
	IUnitOfWork _uow;
	private readonly IAbstractionService _apiService;
	private readonly IMediator _mediator;
	public UpsertCWOHandler(IUnitOfWork uow, IAbstractionService apiService, IMediator mediator)
	{
		_uow = uow;
		_apiService = apiService;
		_mediator = mediator;
	}
	public async Task<UpsertCWOResult> Handle(UpsertCWOCommand request, CancellationToken cancellationToken)
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


		var cwoData = await _apiService.CertisTransaction.GetCWOUpdatesList(syncDateTime, syncDateTimeEnd);
		for (int i = 0; i < cwoData.Count; i++)
		{
			idList.Add(cwoData[i].Id);
			//CWO Notification
			//cehck status from db
			var cwolastsyncdata = await _uow.CWORepository.GetById(cwoData[i].Id, false, false);
			if (cwolastsyncdata == null || cwolastsyncdata.StatusId != cwoData[i].StatusId)
			{
				try
				{
					if (cwoData[i].StatusId != null && request.MessageTemplate == null)
					{
						await CWONotification(cwoData[i].StatusId.Value, cwoData[i].SupervisorId, cwoData[i].TechnicianId, cwoData[i].Id, cwoData[i].Name, cwolastsyncdata?.StatusId);
					}
					else if (request.CWOId != cwoData[i].Id && request.CWOId != null && request.MessageTemplate != null)
					{
						await CWONotification(cwoData[i].StatusId.Value, cwoData[i].SupervisorId, cwoData[i].TechnicianId, cwoData[i].Id, cwoData[i].Name, cwolastsyncdata?.StatusId);
					}
				}
				catch (Exception ex)
				{
				}
			}
			await _uow.CWORepository.UpsertCWO(cwoData[i]);
			await _uow.SaveChangeAsyncWithCommit();
		}
		try
		{
			if (request.MessageTemplate != null && request.CWOId != null)
			{
				await UpdateCWOSendNotification(request.CWOId.Value, request.MessageTemplate, request.SendFrom.Value, request.SendTo.Value);
			}
		}
		catch { }


		return new UpsertCWOResult() { Count = idList.Count() };
	}
	private async Task CWONotification(int status, string? supervisorEmail, string? technicianEmail, int cwoId, string cwoNumber, int? formStatus)
	{

		var templateKey = status switch
		{
			2 => Constant.CWO_MOZART_ASSIGN,
			3 => Constant.CWO_ASSIGN,
			4 => Constant.CWO_ACK,
			5 => Constant.CWO_COMPLETE,
			6 => Constant.CWO_CLOSE,
			// 7 => Constant.CWO_CLIENT_VERIFIED,
			// 8 => Constant.CWO_CANCLE,
			_ => null
		};

		if (templateKey == null) return;

		var templateMessage = await _uow.AppConfigRepository.GetValueByName(templateKey);
		var templateMessageEn = await _uow.AppConfigRepository.GetValueByName(templateKey + "_EN");


		var replacements = new Dictionary<string, string>
				{
						{ "<<cwoname>>", cwoNumber },
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

				await SendNotification(supervisorEmail, $"{cwoNumber} ต้องดำเนินการแก้ไขงานใหม่", $"{cwoNumber} requires rework", cwoId);
				await SendNotification(technicianEmail, $"{cwoNumber} ต้องดำเนินการแก้ไขงานใหม่", $"{cwoNumber} requires rework", cwoId);
			}
			else if (status == 2 && formStatus == 3)
			{

				await SendNotification(supervisorEmail, $"{cwoNumber} ถูกปฏิเสธ", $"{cwoNumber} has been REJECTED", cwoId);
			}
			else
			{
				await SendNotification(supervisorEmail, templateMessage, templateMessageEn, cwoId);
				await SendNotification(technicianEmail, templateMessage, templateMessageEn, cwoId);
			}
		}
		else
		{
			await SendNotification(supervisorEmail, templateMessage, templateMessageEn, cwoId);
			await SendNotification(technicianEmail, templateMessage, templateMessageEn, cwoId);
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

	private async Task SendNotification(string? email, string message, string messageEn, int cwoId)
	{
		if (string.IsNullOrEmpty(email)) return;
		var data = await _apiService.MasterData.GetMasterUsers();
		var usermozart = data.FirstOrDefault(x => x.Id == Guid.Parse(email));
		if (usermozart == null) return;
		var user = await _uow.MemberRepository.GetByEmail(usermozart.Email, true, true);
		if (user == null) return;

		var sendNoti = new SendFCMNotiCommand
		{
			Message = message,
			MessageEn = messageEn,
			FromUser = Constant.MOZART_GUID,
			ToUser = user.MID,
			FromUserName = "Mozart",
			ToUserName = usermozart.Username ?? "",
			NotificationType = Constant.CWO_MESSAGE_TYPE,
			workId = cwoId
		};

		await _mediator.Send(sendNoti);
	}

	private Task<(string, string)> ReplaceTemplate(string template, string templateen, string cwoNumber, int cwoStatus, string toUsername)
	{
		var templateMessage = template;
		var templateMessageEn = templateen;

		var replacements = new Dictionary<string, string>
		{
				{ "<<cwoname>>", cwoNumber },
				{ "<<name>>", toUsername },
				{ "<<fromstatus>>", GetFromStatus(cwoStatus) },
				{ "<<tostatus>>", GetToStatus(cwoStatus) },
		};

		foreach (var (key, value) in replacements)
		{
			templateMessage = templateMessage.Replace(key, value);
			templateMessageEn = templateMessageEn.Replace(key, GetEnglishEquivalent(value)); // Ensuring English equivalent replacement
		}

		return Task.FromResult((templateMessage, templateMessageEn)); // Wrapping in a Task for async compatibility
	}
	private async Task UpdateCWOSendNotification(int cwoid, string appconfig, Guid sendForm, Guid sendTo)
	{
		var messagetemplate = await _mediator.Send(new GetAppConfigByNameQuery(appconfig));
		var messagetemplaten = await _mediator.Send(new GetAppConfigByNameQuery(appconfig + "_EN"));
		var user = await _mediator.Send(new MasterUserQuery(sendForm, sendTo));
		var fuser = Guid.Empty;
		var tuser = Guid.Empty;
		var fusername = "";
		var tusername = "";
		var cwodetail = await _mediator.Send(new CWODetailQuery(cwoid));

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
		var (template, templateEn) = await ReplaceTemplate(messagetemplate, messagetemplaten, cwodetail.CWORefNumber, cwodetail.Status, fusername);

		var sendnoti = new SendFCMNotiCommand()
		{
			Message = template,
			MessageEn = templateEn,
			FromUser = fuser,
			ToUser = tuser,
			FromUserName = user.FromUserName ?? "",
			ToUserName = user.ToUserName ?? "",
			NotificationType = Constant.CWO_MESSAGE_TYPE,
			workId = cwodetail.CWOID
		};
		await _mediator.Send(sendnoti);
	}

}