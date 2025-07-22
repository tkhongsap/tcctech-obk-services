using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedureList;
public class GetActivityProcedureListQueryHandler : IQueryHandler<GetActivityProcedureListQuery, GetActivityProcedureListResult>
{

	IUnitOfWork _uow;
	public GetActivityProcedureListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetActivityProcedureListResult> Handle(GetActivityProcedureListQuery request, CancellationToken cancellationToken)
	{
		var apList = await _uow.ActivityProcedureRepository.GetAll(request.Filter, true, request);
		var totalCount = await _uow.ActivityProcedureRepository.GetAllCount(request.Filter, true);

		var res = new List<GetActivityProcedure>();
		foreach (var item in apList)
		{
			var listSubtaskAction = JsonConvert.DeserializeObject<List<APSubtaskActionResult>>(item.SubtaskActions);
			var locationName = "";

			if (item.location != null && item.location.BuildingZoneName != null)
			{
				locationName += $"{item.location.BuildingZoneName}";
			}

			if (item.location != null && item.location.FloorName != null)
			{
				if (item.location.BuildingZoneName != null)
				{ 
					locationName += ", "; 
				}
				locationName += $"{item.location.FloorName}";
			}

			if (item.location != null && item.location.Space != null)
			{
				if (item.location.FloorName != null)
				{
					locationName += ", ";
				}
				locationName += $"{item.location.Space}";
			}

			var rs = new GetActivityProcedure()
			{
				Id = item.Id,
				TaskName = item.TaskName,
				Code = item.Code,
				Location = locationName,
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

		return new GetActivityProcedureListResult(paginate, res);
	}
}
