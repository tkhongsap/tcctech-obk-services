using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Register;
public class RegisterCommand : ICommand<RegisterResult>
{
	public string accid { get; set; }
	public string token { get; set; }
	public object? metadata { get; set; }
}