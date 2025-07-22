//using TCCT.ServiceAbstraction.Application.Configuration.Commands;
//using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

//namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;

//public sealed class LoginCommandHandler : ICommandHandler<LoginCommand, LoginResult>
//{
//	private readonly IFinedayIvivaService _service;
//	public LoginCommandHandler(IFinedayIvivaService service)
//	{
//		_service = service;
//	}

//	public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
//	{
//		var res = await _service.WithLogin().Login(request.Username, request.Password);
//		return res;
//	}

//}

