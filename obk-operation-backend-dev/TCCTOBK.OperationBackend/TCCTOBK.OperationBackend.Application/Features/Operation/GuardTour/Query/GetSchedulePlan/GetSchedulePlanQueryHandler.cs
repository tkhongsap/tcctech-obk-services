using System.Collections.Generic;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSchedulePlan;
public class GetSchedulePlanQueryHandler : IQueryHandler<GetSchedulePlanQuery, GetSchedulePlanResult>
{
	IUnitOfWork _uow;
	public GetSchedulePlanQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetSchedulePlanResult> Handle(GetSchedulePlanQuery request, CancellationToken cancellationToken)
	{
		var result = await _uow.SchedulePlanRepository.GetById(new Guid(request.SDPID), true);
		var name = !string.IsNullOrWhiteSpace(result.taMember.FirstName) || !string.IsNullOrWhiteSpace(result.taMember.LastName)
				? $"{result.taMember.FirstName} {result.taMember.LastName}".Trim()
				: result.taMember.Name ?? result.taMember.Email;
		var res = new GetSchedulePlanResult()
		{
			Id = result.Id,
			Route = result.Route,
			StartTime = result.StartTime,
			EndTime = result.EndTime,
			MemberName = name.Trim(),
			Frequency = JsonConvert.DeserializeObject<List<string>>(result.Frequency!),
			MemberId = result.MID.ToString(),
			IsActive = result.IsActive
		};
		return res;
	}
}
