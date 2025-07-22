using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSchedulePlanList;
public class GetSchedulePlanListQueryHandler : IQueryHandler<GetSchedulePlanListQuery, GetSchedulePlanListResult>
{

	IUnitOfWork _uow;
	public GetSchedulePlanListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetSchedulePlanListResult> Handle(GetSchedulePlanListQuery request, CancellationToken cancellationToken)
	{
		var schedulePlans = await _uow.SchedulePlanRepository.GetAll(request.SchedulePlanId, request.Filter, request.SchedulePlanIds, null, null, null, true, request, request.IsActive);
		var totalCount = await _uow.SchedulePlanRepository.GetAllCount(request.SchedulePlanId, request.Filter, request.SchedulePlanIds, request.IsActive);
		var res = new List<GetSchedulePlanList>();
		foreach (var item in schedulePlans)
		{
			var name = !string.IsNullOrWhiteSpace(item.taMember.FirstName) || !string.IsNullOrWhiteSpace(item.taMember.LastName)
				? $"{item.taMember.FirstName} {item.taMember.LastName}".Trim()
				: item.taMember.Name ?? item.taMember.Email;
			var rs = new GetSchedulePlanList()
			{
				Id = item.Id,
				Route = item.Route,
				StartTime = item.StartTime,
				EndTime = item.EndTime,
				MemberName = name.Trim(),
				MemberId = item.MID.ToString(),
				Frequency = JsonConvert.DeserializeObject<List<string>>(item.Frequency!),
				IsActive = item.IsActive
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

		return new GetSchedulePlanListResult(paginate, res);
	}
}
