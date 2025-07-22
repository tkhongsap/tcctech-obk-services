using System.Text.Json.Serialization;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.StaffRepository;


namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.RosterRepository;

public class ComponentStaffModel
{
	public List<StaffWithLoginToDayModel> Staffs { get; set; }
	public int? ActualLogin { get; set; } = 0;

	public int? WeekDay { get; set; } = 0;
	public int? WeekEnd { get; set; } = 0;

}