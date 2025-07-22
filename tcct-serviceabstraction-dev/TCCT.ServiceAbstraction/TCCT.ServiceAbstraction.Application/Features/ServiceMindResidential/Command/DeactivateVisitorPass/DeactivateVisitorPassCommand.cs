using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.DeactivateVisitorPass;
public class DeactivateVisitorPassCommand : ICommand<DeactivateVisitorPassResult>
{
	public string InviterId { get; set; }
}