using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SetState;
public class SetStateCommand : ICommand<SetStateResult>
{
	public string? tenant_id { get; set; }
	public string operation { get; set; } = string.Empty;
	public string id { get; set; } = null!;
	public List<Module>? modules { get; set; } = new List<Module>();
	public List<Room>? rooms { get; set; } = new List<Room>();
}

public class Module
{
	
	public string id { get; set; } = null!;
	public string? bridge { get; set; } = string.Empty;
	public bool? on { get; set; }
	public string? scenario { get; set; }
	public int? target_position { get; set; }
	public int? fan_speed { get; set; }
	public int? brightness { get; set; }
}

public class Room
{
	public string id { get; set; } = null!;
	public string? therm_setpoint_mode { get; set; } = string.Empty;
	public float? therm_setpoint_temperature { get; set; }
	public int? therm_setpoint_end_time { get; set; }
}

