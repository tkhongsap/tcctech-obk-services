namespace TCCTOBK.OperationBackend.Application;

public class ConfigMarcom
{
	public int Type { get; set; }
	public int Time { get; set; }
	public bool IsShowMessage { get; set; }

	public ConfigMarcom(int type,int time,bool isShowMessage)
	{
		Type = type;
		Time = time;
		IsShowMessage = isShowMessage;
	}
}
