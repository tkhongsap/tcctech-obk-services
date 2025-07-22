using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateVisitorStatus;
public class UpdateVisitorStatusCommand : ICommand<UpdateVisitorStatusResult>
{
	public string TenantId { get; set; }
	public string VisitorId { get; set; }
	public bool isActive { get; set; }
}

