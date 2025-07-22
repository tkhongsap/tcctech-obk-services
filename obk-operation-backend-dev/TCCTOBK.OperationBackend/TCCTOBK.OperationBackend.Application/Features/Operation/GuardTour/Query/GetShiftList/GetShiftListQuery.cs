using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftList;
public class GetShiftListQuery : TableState, IQuery<GetShiftListResult>
{
	public string? Name { get; set; }
}