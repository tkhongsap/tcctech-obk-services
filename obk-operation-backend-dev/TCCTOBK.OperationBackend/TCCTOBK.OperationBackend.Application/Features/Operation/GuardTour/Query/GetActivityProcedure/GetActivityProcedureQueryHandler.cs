using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedure;
public class GetActivityProcedureQueryHandler : IQueryHandler<GetActivityProcedureQuery, GetActivityProcedureResult>
{
	IUnitOfWork _uow;
	public GetActivityProcedureQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetActivityProcedureResult> Handle(GetActivityProcedureQuery request, CancellationToken cancellationToken)
	{
		var ap = await _uow.ActivityProcedureRepository.GetById(request.APID, true);
		var locationName = "";
		if (ap.location != null)
		{
			locationName = $"{ap.location.SiteName}";
		}

		if (ap.location != null && ap.location.ZoneName != null)
		{
			locationName += $", {ap.location.ZoneName}";
		}

		if (ap.location != null && ap.location.BuildingName != null)
		{
			locationName += $", {ap.location.BuildingName}";
		}

		var listSubtaskAction = JsonConvert.DeserializeObject<List<APSubtaskActionResult>>(ap.SubtaskActions);

		var res = new GetActivityProcedureResult()
		{
			Id = ap.Id,
			TaskName = ap.TaskName,
			Code = ap.Code,
			SubtaskActions = listSubtaskAction ?? [],
			Location = locationName,
			LocationId = ap.LocationId
		};

		return res;
	}
}
