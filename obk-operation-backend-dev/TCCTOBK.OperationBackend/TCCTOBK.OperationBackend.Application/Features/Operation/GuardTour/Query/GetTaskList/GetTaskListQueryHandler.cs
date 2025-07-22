using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskList;
public class GetTaskListQueryHandler : IQueryHandler<GetTaskListQuery, GetTaskListResult>
{

	IUnitOfWork _uow;
	public GetTaskListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetTaskListResult> Handle(GetTaskListQuery request, CancellationToken cancellationToken)
	{
		var dateStart = request.DateStart;
		var dateEnd = request.DateEnd;
		if (dateStart == null && dateEnd == null)
		{
			var now = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
			dateStart = now.AddDays(-1).ToString("yyyy-MM-dd HH:mm:ss");
			dateEnd = now.AddDays(2).ToString("yyyy-MM-dd HH:mm:ss");
		}
		if (request.Role >= 3)
		{
			request.MemberId = null;
		}
		var tasks = await _uow.TaskRepository.GetAll(request.MemberId, request.Filter, request.TaskIds, dateStart, dateEnd, request, request.Status);
		var totalCount = await _uow.TaskRepository.GetAllCount(request.MemberId, request.Filter, request.TaskIds, dateStart, dateEnd, request.Status);
		var statusCount = await _uow.TaskRepository.GetStatusCount(request.MemberId, request.Filter, request.TaskIds, dateStart, dateEnd, request.Status);

		var scr = new Dictionary<string, int>
		{
			{ "Assign", statusCount.ContainsKey(Constant.GUARD_TOUR_STATUS_ASSIGNED) ? statusCount[Constant.GUARD_TOUR_STATUS_ASSIGNED] : 0 },
			{ "InProgress", statusCount.ContainsKey(Constant.GUARD_TOUR_STATUS_INPROGRESS) ? statusCount[Constant.GUARD_TOUR_STATUS_INPROGRESS] : 0 },
			{ "Completed", statusCount.ContainsKey(Constant.GUARD_TOUR_STATUS_COMPLETED) ? statusCount[Constant.GUARD_TOUR_STATUS_COMPLETED] : 0 },
			{ "Skip", statusCount.ContainsKey(Constant.GUARD_TOUR_STATUS_SKIP) ? statusCount[Constant.GUARD_TOUR_STATUS_SKIP] : 0 },
			{ "Cancel", statusCount.ContainsKey(Constant.GUARD_TOUR_STATUS_CANCELLED) ? statusCount[Constant.GUARD_TOUR_STATUS_CANCELLED] : 0 },
		};

		var res = new List<GetTask>();
		tasks = tasks.OrderByDescending(x => x.UpdatedDate).ToList();
		foreach (var item in tasks)
		{
			var rs = new GetTask()
			{
				Id = item.Id,
				Name = item.Name,
				MemberId = item.MemberId,
				Status = item.StatusId,
				StartDate = item.StartDate?.ToString("ddd, MMM dd yyyy HH:mm") ?? "",
				EndDate = item.EndDate?.ToString("ddd, MMM dd yyyy HH:mm") ?? "",
				StartToEndDate = item.StartDate?.ToString("ddd, MMM dd yyyy HH:mm") + " - " + item.EndDate?.ToString("HH:mm"),
				UpdateAt = item.UpdatedDate.ToString("ddd, MMM dd yyyy HH:mm") ?? "",
				CancelReason = item.CancelReason,
			};
			res.Add(rs);
		}

		var paginate = new Paginate()
		{
			Count = res.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		return new GetTaskListResult(paginate, scr, res);
	}
}
