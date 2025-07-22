using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetLocationList;
public class GetLocationListQuery : TableState, IQuery<GetLocationListResult>
{
	public string? Filter { get; set; }
	public Guid? LocationId { get; set; }
	public List<Guid> LocationIds { get; set; } = new();
	public string? Types { get; set; }
}