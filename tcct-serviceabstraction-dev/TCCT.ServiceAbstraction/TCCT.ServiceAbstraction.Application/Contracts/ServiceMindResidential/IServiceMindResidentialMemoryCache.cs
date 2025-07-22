using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AuthorizeTenant;

namespace TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
public interface IServiceMindResidentialMemoryCache
{	
	Task<AuthorizeTenantResult> GetTokenCache(Func<string?, Task<AuthorizeTenantResult>> func, string parameter);
}
