using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;

namespace TCCTOBK.OperationBackend.Application.Contracts.API;

public interface IUserService
{
	[Post("/api/v1/operation/kc/login")]
	Task<LoginResponseModel> Login([Body] LoginRequestModel data);

	[Post("/api/v1/operation/kc/user")]
	Task<CreateUserKCReponseModel> CreateUser([Body] CreateUserKCRequestModel data);


	[Get("/api/v1/operation/kc/staff_event_logs")]
	Task<List<EventsLogResult>> EventsLog([Query] int max, string type);


	[Post("/api/v1/operation/kc/password/reset")]
	Task<CreateUserKCReponseModel> ResetPasswordCMS([Body] ResetPasswordModel data);

	[Put("/api/v1/operation/kc/password")]
	Task<CreateUserKCReponseModel> ChangePassword([Body] ChangePasswordModel data);
}
