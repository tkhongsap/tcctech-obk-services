using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSubtask;
public class GetSubtaskQuery : TableState, IQuery<GetSubtaskResult>
{
    public string? Filter { get; set; }
	public List<Guid>? SubTaskIds { get; set; } 
}
