using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSchedulePlan;
public class GetSchedulePlanQuery : IQuery<GetSchedulePlanResult>
{
	public string SDPID { get; set; }
	public GetSchedulePlanQuery(string sdpid)
	{
		SDPID = sdpid;
	}
}