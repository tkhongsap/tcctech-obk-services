using MediatR;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskSubtaskRepository;
using TCCTOBK.OperationBackend.Application.Features.Mobile.FCMSendNotification.Command.SendFCMNoti;
using TCCTOBK.OperationBackend.Application.Features.OBOperation.AppConfig.Query.GetAppConfigByName;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActivityProcedureByTask;

public class CreateActivityProcedureByTaskHandler : IRequestHandler<CreateActivityProcedureByTaskCommand, CreateActivityProcedureByTaskResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	IMediator _mediator;
	public CreateActivityProcedureByTaskHandler(IUnitOfWork uow, IMailService msr, IMediator mediator)
	{
		_uow = uow;
		_msr = msr;
		_mediator = mediator;
	}
	public async Task<CreateActivityProcedureByTaskResult> Handle(CreateActivityProcedureByTaskCommand request, CancellationToken cancellationToken)
	{
		var state = new TableState();
		var dateTimeNow = DateTime.Now.ToUniversalTime().AddHours(7);
		var now = new DateTime(dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day, 0, 0, 0);

		DateTime startDate = request.StartDate;
		DateTime endDate = request.EndDate;

		var activityProcedureId = request.ActivityProcedureId;
		var plan = await _uow.ActivityProcedureRepository.GetById(activityProcedureId, false);
		var taskStart = startDate;
		var taskEnd = endDate;

		if (taskEnd < taskStart) taskEnd = taskEnd.AddDays(1);

		var createTask = new CreateTaskModel(plan.TaskName, 0, taskStart, taskEnd, plan.LocationId, request.Mid);
		var taskId = await _uow.TaskRepository.CreateTask(createTask, request);

		List<CreateTaskSubtaskModel> listTaskSubtask = new List<CreateTaskSubtaskModel>();
		List<CreateSubtaskActionModel> listSubtaskAction = new List<CreateSubtaskActionModel>();

		var subtaskActionPlan = JsonConvert.DeserializeObject<List<APSubtaskActionResult>>(plan.SubtaskActions);

		foreach (var subtask in subtaskActionPlan ?? [])
		{
			foreach (var action in subtask.Actions)
			{
				await _uow.ActionRepository.GetById(action, false);
			}

			var createSubtask = new CreateSubtaskModel(subtask.Name, 0, subtask.Actions);
			var subtaskId = await _uow.SubtaskRepository.CreateSubtask(createSubtask, request);
			listSubtaskAction.Add(new CreateSubtaskActionModel(subtaskId, subtask.Actions, 0));
			listTaskSubtask.Add(new CreateTaskSubtaskModel(taskId, subtaskId));
		}

		await _uow.SubtaskActionRepository.CreateSubtaskAction(listSubtaskAction, request);
		await _uow.TaskSubtaskRepository.CreateTaskSubtask(listTaskSubtask, request);

		try
		{
			var appconfig = Constant.GUATD_TOUR_ASSIGN;

			var messagetemplate = await _mediator.Send(new GetAppConfigByNameQuery(appconfig));
			var messagetemplaten = await _mediator.Send(new GetAppConfigByNameQuery(appconfig + "_EN"));
			messagetemplate = messagetemplate;
			messagetemplaten = messagetemplaten;

			var socuser = await _mediator.Send(new GetSocMemberQuery());
			var socusername = socuser.Data.FirstOrDefault(x => x.Id == request.Mid)?.Name;

			var sendnoti = new SendFCMNotiCommand()
			{
				Message = messagetemplate,
				MessageEn = messagetemplaten,
				FromUser = plan.CreatedBy,
				ToUser = request.Mid,
				FromUserName = "-",
				ToUserName = socusername ?? "",
				NotificationType = Constant.GUARD_TOUR_MESSAGE_TYPE,
			};
			await _mediator.Send(sendnoti);

		}
		catch
		{
		}

		await _uow.SaveChangeAsyncWithCommit();

		return new CreateActivityProcedureByTaskResult();
	}
}
