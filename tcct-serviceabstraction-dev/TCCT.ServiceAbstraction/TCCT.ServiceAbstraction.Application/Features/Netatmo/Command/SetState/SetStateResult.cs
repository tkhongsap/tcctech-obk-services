using System.Text.Json.Serialization;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SetState;

public class SetStateResult
{
	public string status { get; set; }
	public int time_server { get; set; }
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public Body? body { get; set; }
}
public class Body
{
	public HomeResult home { get; set; }
	public List<Error> errors { get; set; }
}

public class Error
{
	public int code { get; set; }
	public string id { get; set; }
}

public class HomeResult
{
	public string id { get; set; }
}


