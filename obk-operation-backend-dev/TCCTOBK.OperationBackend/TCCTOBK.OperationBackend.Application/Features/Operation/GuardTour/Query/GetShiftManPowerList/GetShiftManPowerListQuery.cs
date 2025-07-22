using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftManPowerList;
public class GetShiftManPowerListQuery : TableState, IQuery<GetShiftManPowerListResult>
{
	public string? Shift { get; set; }
}