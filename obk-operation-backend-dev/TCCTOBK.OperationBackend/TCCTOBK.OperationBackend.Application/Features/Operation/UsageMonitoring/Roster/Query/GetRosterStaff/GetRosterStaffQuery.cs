using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterStaff;
public class GetRosterStaffQuery : TableState, IQuery<List<StaffWithLoginToDayModel>>
{
	public string? Component { get; set; }
	public DateTime Date { get; set; } = DateTime.UtcNow;
}