using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.UpdateParcelReadStatus;
public class UpdateParcelReadStatusCommand : ICommand<UpdateParcelReadStatusResult>
{
	public string TenantId { get; set; }
	public int ParcelId { get; set; }
}

