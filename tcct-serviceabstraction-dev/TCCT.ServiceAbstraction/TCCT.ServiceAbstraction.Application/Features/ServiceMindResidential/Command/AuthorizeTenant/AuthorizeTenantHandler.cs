using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AuthorizeTenant;
public class AuthorizeTenantHandler : ICommandHandler<AuthorizeTenantCommand, AuthorizeTenantResult>
{
	private readonly IServiceMindResidential _service;
	public AuthorizeTenantHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<AuthorizeTenantResult> Handle(AuthorizeTenantCommand request, CancellationToken cancellationToken)
	{
		return await _service.AuthorizeTenant(request);
	}
}