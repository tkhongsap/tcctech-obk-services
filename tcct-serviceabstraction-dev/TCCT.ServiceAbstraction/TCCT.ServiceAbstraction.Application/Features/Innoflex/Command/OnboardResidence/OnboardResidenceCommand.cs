using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.OnboardResidence;
public class OnboardResidenceCommand : ICommand<OnboardResidenceResult>
{
	public string userId { get; set; }
	public string? accountId { get; set; }
	public string firstName { get; set; }
	public string lastName { get; set; }
	public string cardNo { get; set; }
	public string buildingCode { get; set; }
	public string floorCode { get; set; }
	public string roomCode { get; set; }
	public string validityPeriod { get; set; }
	public string userImage { get; set; }
}