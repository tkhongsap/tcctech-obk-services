using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionTypeList;
public class GetActionTypeListQuery : TableState, IQuery<GetActionTypeListResult>
{
	public string? Filter { get; set; }
	public Guid? ActionTypeId { get; set; }
	public List<Guid> ActionTypeIds { get; set; } = new();
}