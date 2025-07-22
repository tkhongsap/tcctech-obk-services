namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.Scenario;
public class ScenariosResult
{
	public string status { get; set; }
	public int time_server { get; set; }
	public ScenariosBody body { get; set; }
}
public class ScenariosBody
{
	public Home home { get; set; }
	public List<Error> errors { get; set; }
}

public class Error
{
	public int code { get; set; }
	public string id { get; set; }
}

public class Home
{
	public string id { get; set; }
	public List<Scenario> scenarios { get; set; }
}

public class Scenario
{
	public string type { get; set; }
	public string id { get; set; }
	public string category { get; set; }
	public bool customizable { get; set; }
	public bool editable { get; set; }
	public bool deletable { get; set; }
	public string name { get; set; }
}
