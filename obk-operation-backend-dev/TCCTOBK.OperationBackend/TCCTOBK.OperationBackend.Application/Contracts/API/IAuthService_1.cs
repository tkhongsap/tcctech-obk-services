using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;

namespace TCCTOBK.OperationBackend.Application.Contracts.API;
public interface IAuthService
{
	[Post("/api/oauth2/token")]
	Task<AuthResponseModel> GetToken([Body] AuthRequestModel data);
}
