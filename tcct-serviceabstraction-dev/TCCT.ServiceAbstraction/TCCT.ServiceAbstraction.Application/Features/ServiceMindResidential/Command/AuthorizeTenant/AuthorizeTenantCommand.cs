using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AuthorizeTenant;
public class AuthorizeTenantCommand : ICommand<AuthorizeTenantResult>
{
	public string TenantId { get; set; } = null!;

	public AuthorizeTenantCommand(string tenantId)
	{
		TenantId = tenantId;
	}
}
