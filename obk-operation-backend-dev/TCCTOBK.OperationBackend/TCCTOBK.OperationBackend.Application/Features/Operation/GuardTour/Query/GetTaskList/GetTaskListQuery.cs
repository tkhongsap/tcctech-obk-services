using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskList;
public class GetTaskListQuery : TableState, IQuery<GetTaskListResult>
{
	public string? Filter { get; set; }
	public Guid? MemberId { get; set; }
	public List<Guid> TaskIds { get; set; } = new();
	public int? Status { get; set; }
	public string? DateStart { get; set; }
	public string? DateEnd { get; set; }
	public int Role { get; set; }
}