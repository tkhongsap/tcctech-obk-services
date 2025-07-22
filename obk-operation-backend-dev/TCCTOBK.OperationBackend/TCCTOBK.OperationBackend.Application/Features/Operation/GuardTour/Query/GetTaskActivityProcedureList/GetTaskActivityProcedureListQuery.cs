using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskActivityProcedureList;
public class GetTaskActivityProcedureListQuery : TableState, IQuery<GetTaskActivityProcedureListResult>
{
	public string? Filter { get; set; }
}