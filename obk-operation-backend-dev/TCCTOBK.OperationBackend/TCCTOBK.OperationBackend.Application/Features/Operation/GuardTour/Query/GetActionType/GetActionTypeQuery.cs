using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionType;
public class GetActionTypeQuery : IQuery<GetActionTypeResult>
{
	public string ATID { get; set; }
	public GetActionTypeQuery(string atid)
	{
		ATID = atid;
	}
}