using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetAction;
public class GetActionQuery : IQuery<GetActionResult>
{
	public string AID { get; set; }
	public bool Scope { get; set; }
	public GetActionQuery(string aid, bool scope)
	{
		AID = aid;
		Scope = scope;
	}
}