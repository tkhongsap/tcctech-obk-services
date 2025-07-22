using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;

namespace TCCTOBK.OperationBackend.Application.Contracts.API;
public interface IAbstractionOperationService
{
	[Post("/api/v1/operation/kc/login")]
	Task<LoginResponseModel> Login([Body] LoginRequestModel data);
	[Post("/api/v1/operation/kc/refresh-token")]
	Task<RefreshTokenResponseModel> RefreshToken([Body] RefreshTokenRequestModel data);
}
