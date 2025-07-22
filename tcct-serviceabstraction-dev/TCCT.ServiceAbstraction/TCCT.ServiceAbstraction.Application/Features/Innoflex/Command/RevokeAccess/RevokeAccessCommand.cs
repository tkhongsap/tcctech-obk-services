using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.RevokeAccess;
public class RevokeAccessCommand : ICommand<RevokeAccessResult>
{
	public string userId { get; set; }
	public string cardNo { get; set; }
	public string buildingCode { get; set; }
	public string floorCode { get; set; }
	public string roomCode { get; set; }
}