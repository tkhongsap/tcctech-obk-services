using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTask;
public class GetTaskQuery : IQuery<GetTaskResult>
{
	public string TID { get; set; }
	public bool Scope { get; set; }

	public GetTaskQuery(string tid, bool scope)
	{
		TID = tid;
		Scope = scope;
	}
}
