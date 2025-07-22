using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetServiceRequestEventTypes;
public class GetServiceRequestEventTypesCommand : ICommand<GetServiceRequestEventTypesResult>
{
	public string TenantId { get; set; }
}