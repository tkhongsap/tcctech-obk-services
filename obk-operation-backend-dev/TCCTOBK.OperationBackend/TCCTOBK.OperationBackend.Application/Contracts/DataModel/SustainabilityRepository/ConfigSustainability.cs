namespace TCCTOBK.OperationBackend.Application;

public class ConfigSustainability
{
	public int Type { get; set; }
	public int Time { get; set; }

	public ConfigSustainability(int type, int time)
	{
		Type = type;
		Time = time;
	}
}
