using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;

namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
public interface IFinedayResidenceMemoryCache
{
	Task<LoginResult> GetTokenCache(Func<Task<LoginResult>> func);
}
