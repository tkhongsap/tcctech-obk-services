using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.RegisterNewTenant;
public class RegisterNewTenantHandler : ICommandHandler<RegisterNewTenantCommand, RegisterNewTenantResult>
{
	private readonly IServiceMindResidential _service;
	public RegisterNewTenantHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<RegisterNewTenantResult> Handle(RegisterNewTenantCommand request, CancellationToken cancellationToken)
	{
		return await _service.RegisterNewTenant(request);
	}
}