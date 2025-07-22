using System.Text.Json.Serialization;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.EventsLogRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RosterRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;


namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.Summary;

public class SummaryResult
{
	public int FixedDailyUserTarget { get; set; }
	public int AtcualActiveDailyUser { get; set; }
	public int TotlaOnGroundStaffMustUseOpsApp { get; set; }
	public int TotalDalilyOnGroundStaffMustUseOpsAppWithRegister { get; set; }
	public int TotalDalilyOnGroundStaffMustUseOpsAppWithOutRegister { get; set; }
	public new Dictionary<string, ComponentStaffModel> Component { get; set; }
	public List<StatisticsResultModel> Statistics { get; set; }
	public List<StaffWithLoginToDayModel> AllStaff { get; set; }


}
