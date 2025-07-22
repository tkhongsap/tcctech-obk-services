using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.ForceLogout;
public class ForceLogoutCommand : ICommand<ForceLogoutResult>
{
	public int userID { get; set; }

	public ForceLogoutCommand(int userid)
	{
		userID = userid;
	}
}
