using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Security.Command;
public class LoginCommandHandler : ICommandHandler<LoginCommand, LoginResult>
{
	IAbstractionService _absservice;

	public LoginCommandHandler(IAbstractionService absservice)
	{
		_absservice = absservice;
	}

	public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
	{
		var req = new LoginRequestModel(request.Username, request.Password);
		var loginres = _absservice.Operation.Login(req);

		var res = new LoginResult();
		return res;
	}
}
