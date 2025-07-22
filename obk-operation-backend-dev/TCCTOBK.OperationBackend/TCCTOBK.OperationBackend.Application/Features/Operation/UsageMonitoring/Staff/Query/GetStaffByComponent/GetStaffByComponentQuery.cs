using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffByComponent;
public class GetStaffByComponentQuery : IQuery<List<StaffWithLoginToDayModel>>
{
	public DateTime Date { get; set; } = DateTime.UtcNow;

	public bool? MustUseOpsApp { get; set; }
}