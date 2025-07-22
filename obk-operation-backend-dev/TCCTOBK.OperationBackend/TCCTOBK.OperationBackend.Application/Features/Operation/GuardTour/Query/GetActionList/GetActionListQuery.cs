using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionList;
public class GetActionListQuery : TableState, IQuery<GetActionListResult>
{
	public string? Filter { get; set; }
	public Guid? ActionId { get; set; }
	public Guid? ActionTypeId { get; set; }
	public List<Guid> ActionIds { get; set; } = new();
}