using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.OnboardingSyncUpdates;
public class OnboardingSyncUpdatesCommand : ICommand<OnboardingSyncUpdatesResult>
{
	public List<OnboardingSyncUpdatesCommandBody> Updates { get; set; }
}
public class OnboardingSyncUpdatesCommandBody
{
	public string userId { get; set; }
	public string buildingCode { get; set; }
	public string floorCode { get; set; }
	public string roomCode { get; set; }
	public bool sucessStatus { get; set; }
	public string cardNo { get; set; }
}

	