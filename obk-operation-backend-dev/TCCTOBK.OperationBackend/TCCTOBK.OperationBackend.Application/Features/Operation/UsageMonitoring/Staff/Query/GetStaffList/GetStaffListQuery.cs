using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffList;
public class GetStaffListQuery : TableState, IQuery<GetStaffListResult>
{
	public string? StaffName { get; set; }
	public string? Component { get; set; }
	public bool? MustUseOpsApp { get; set; }
}