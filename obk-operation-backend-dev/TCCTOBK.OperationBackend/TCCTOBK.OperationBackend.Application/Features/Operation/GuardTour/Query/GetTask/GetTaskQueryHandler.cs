using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.Minio;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTask;
public class GetTaskQueryHandler : IQueryHandler<GetTaskQuery, GetTaskResult>
{
	IUnitOfWork _uow;
	IMinioService _minioService;
	public GetTaskQueryHandler(IUnitOfWork uow, IMinioService minioService)
	{
		_uow = uow;
		_minioService = minioService;
	}
	public async Task<GetTaskResult> Handle(GetTaskQuery request, CancellationToken cancellationToken)
	{
		var gtid = new Guid(request.TID);
		var task = await _uow.TaskRepository.GetById(gtid, request.Scope);

		var locationName = "-";
		string? locationSubtask = null;
		if (request.Scope)
		{
			if (task.location != null && task.location.BuildingZoneName != null)
			{
				locationName = $"{task.location.BuildingZoneName}";
				locationSubtask = task.location.BuildingZoneName;
			}
		}

		var res = new GetTaskResult()
		{
			Id = task.Id,
			Name = task.Name,
			MemberId = task.MemberId,
			LocationName = locationName,
			LocationId = task.LocationId,
			Status = task.StatusId,
			StartDate = task.StartDate?.ToString("ddd, MMM dd yyyy") ?? "",
			StartTime = task.StartDate?.ToString("HH:mm") ?? "",
			StartDateTime = task.StartDate,
			EndDate = task.EndDate?.ToString("ddd, MMM dd yyyy") ?? "",
			EndTime = task.EndDate?.ToString("HH:mm") ?? "",
			EndDateTime = task.EndDate,
			AcknowleageBeforeMinutes = DomainConfig.CMSAPI.AcknowleageBeforeMinutes,
			CancelReason = task.CancelReason,
		};

		if (request.Scope == true)
		{
			var countDidSubtask = 0;
			var subtasks = new List<trSubtask>();
			var taskSubtaskOrder = task.trTaskSubtask
				.OrderBy(taskSubtask => taskSubtask.trSubtask.StatusId == Constant.GUARD_TOUR_STATUS_ASSIGNED || taskSubtask.trSubtask.StatusId == Constant.GUARD_TOUR_STATUS_INPROGRESS ? 0 : 1)
				.ThenBy(taskSubtask => taskSubtask.Seq)
				.ToList();
			foreach (var subtask in taskSubtaskOrder)
			{
				if (subtask.trSubtask.StatusId != Constant.GUARD_TOUR_STATUS_ASSIGNED && subtask.trSubtask.StatusId != Constant.GUARD_TOUR_STATUS_INPROGRESS) countDidSubtask++;
				subtasks.Add(subtask.trSubtask);
			}
			var sth = new GetSubtaskQueryHandler(_uow, _minioService);
			var count = task.trTaskSubtask.Count;
			var mapSubtask = await sth.MapSubtask(subtasks, locationSubtask, false);
			res.Subtasks = new SubtaskData()
			{
				TotalRecords = count,
				TotalDidRecords = $"{countDidSubtask}/{count}",
				ProgressSuccess = mapSubtask.Item1 / 100,
				ProgressSuccessText = mapSubtask.Item1.ToString() + "%",
				ProgressFail = mapSubtask.Item2,
				Data = mapSubtask.Item3
			};
		}

		return res;
	}
}
