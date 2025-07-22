namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeStatus;
public class HomeStatusResult
{
	public string status { get; set; }
	public int time_server { get; set; }
	public Body body { get; set; }
}
public class Body
{
	public Home home { get; set; }
}

public class Home
{
	public string id { get; set; }
	public List<Room> rooms { get; set; }
	public List<Module> modules { get; set; }
}

public class Module
{
	public string id { get; set; }
	public string type { get; set; }
	public bool offload { get; set; }
	public int firmware_revision { get; set; }
	public int last_seen { get; set; }
	public bool reachable { get; set; }
	public bool? on { get; set; }
	public int? brightness { get; set; }
	public string bridge { get; set; }
	public int? current_position { get; set; }
	public int? target_position { get; set; }
	public int? target_positionstep { get; set; }
	public bool? cooler_status { get; set; }
	public int? fan_speed { get; set; }
	public string fan_mode { get; set; }
	public int? humidity { get; set; }
}

public class Room
{
	public string id { get; set; }
	public int cooling_setpoint_end_time { get; set; }
	public string cooling_setpoint_mode { get; set; }
	public float therm_measured_temperature { get; set; }
	public float cooling_setpoint_temperature { get; set; }
}