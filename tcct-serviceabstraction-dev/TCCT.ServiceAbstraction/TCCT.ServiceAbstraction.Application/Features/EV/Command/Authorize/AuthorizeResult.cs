namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Authorize;
public class AuthorizeResult
{
	public string token { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
	public bool completed { get; set; }
	public string expired { get; set; }
	public object metadata { get; set; }
}