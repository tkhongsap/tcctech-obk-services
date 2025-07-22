namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Register;
public class RegisterResult
{
	public string token { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
	public bool completed { get; set; }
}
