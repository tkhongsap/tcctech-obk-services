namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.CreateNewHomeSchedule;
public class CreateNewHomeScheduleResult
{
	public Body body { get; set; }
	public string status { get; set; }
	public double time_exec { get; set; }
	public int time_server { get; set; }
}

public class Body
{
	public string schedule_id { get; set; }
}


