using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedureList;
public class GetActivityProcedureListQuery : TableState, IQuery<GetActivityProcedureListResult>
{
	public string? Filter { get; set; }
}