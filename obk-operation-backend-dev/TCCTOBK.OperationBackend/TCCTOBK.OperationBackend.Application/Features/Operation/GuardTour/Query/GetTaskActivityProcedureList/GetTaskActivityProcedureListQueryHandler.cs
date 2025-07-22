using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskActivityProcedureList;
public class GetTaskActivityProcedureListQueryHandler : IQueryHandler<GetTaskActivityProcedureListQuery, GetTaskActivityProcedureListResult>
{

	IUnitOfWork _uow;
	public GetTaskActivityProcedureListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetTaskActivityProcedureListResult> Handle(GetTaskActivityProcedureListQuery request, CancellationToken cancellationToken)
	{
		var apList = await _uow.ActivityProcedureRepository.GetAll(request.Filter, true, request);
		var totalCount = await _uow.ActivityProcedureRepository.GetAllCount(request.Filter, true);

		var res = new List<GetTaskActivityProcedure>();
		foreach (var item in apList)
		{
			var listSubtaskAction = JsonConvert.DeserializeObject<List<APSubtaskActionResult>>(item.SubtaskActions);
			var locationName = "";
			if (item.location != null)
			{
				locationName = $"{item.location.SiteName}";
			}

			if (item.location != null && item.location.ZoneName != null)
			{
				locationName += $", {item.location.ZoneName}";
			}

			if (item.location != null && item.location.BuildingName != null)
			{
				locationName += $", {item.location.BuildingName}";
			}

			if (item.location != null && item.location.BuildingZoneName != null)
			{
				locationName += $", {item.location.BuildingZoneName}";
			}

			if (item.location != null && item.location.FloorName != null)
			{
				locationName += $", {item.location.FloorName}";
			}

			var rs = new GetTaskActivityProcedure()
			{
				Id = item.Id,
				TaskName = item.TaskName,
				Code = item.Code,
				Location = locationName,
				LocationId = item.LocationId,
				SubtaskActions = listSubtaskAction,
				UpdatedBy = item.UpdatedByName,
				UpdatedDate = item.UpdatedDate
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

		return new GetTaskActivityProcedureListResult(paginate, res);
	}
}
