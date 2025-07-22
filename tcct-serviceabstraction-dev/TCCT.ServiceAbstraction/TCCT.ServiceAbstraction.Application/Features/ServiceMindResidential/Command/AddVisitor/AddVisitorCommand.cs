using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AddVisitor;
public class AddVisitorCommand : ICommand<AddVisitorResult>
{
	public string TenantId { get; set; }
	public string? CompanyId { get; set; }
	public string? Name { get; set; }
	public string? IdNumber { get; set; }
	public string? Email { get; set; }
	public string? BuildingId { get; set; }
	public string? UnitId { get; set; }
	public string? FloorId { get; set; }
	public string? ElevatorId { get; set; }
	public string? Date { get; set; }
	public TimeConfig? TimeConfig { get; set; }
	public RepeatConfig? RepeatConfig { get; set; }
}

public class TimeConfig
{
	public bool IsSpecific { get; set; }
	public string? Start { get; set; }
	public string? End { get; set; }
}

public class RepeatConfig
{
	public bool IsRepeat { get; set; }
	public int? Type { get; set; } // 1 for everyday; 2 for every specific date; 3 for every specific day;
	public int? Date { get; set; }
	public List<string>? Days { get; set; } // value can be ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
	public string? EndDate { get; set; }
}
