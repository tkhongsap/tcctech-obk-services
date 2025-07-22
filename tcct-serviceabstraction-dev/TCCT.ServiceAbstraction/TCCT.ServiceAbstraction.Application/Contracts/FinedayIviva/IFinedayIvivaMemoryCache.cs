using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;

namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
public interface IFinedayIvivaMemoryCache
{
	Task<LoginResult> GetTokenCache(Func<Task<LoginResult>> func);
}
