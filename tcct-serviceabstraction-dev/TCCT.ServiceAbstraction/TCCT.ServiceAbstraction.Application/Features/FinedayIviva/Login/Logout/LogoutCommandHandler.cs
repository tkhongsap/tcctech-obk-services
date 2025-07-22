//using TCCT.ServiceAbstraction.Application.Configuration.Commands;
//using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

//namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Logout;

//public sealed class LogoutCommandHandler : ICommandHandler<LogoutCommand, LogoutResult>
//{
//	private readonly IFinedayIvivaService _service;
//	public LogoutCommandHandler(IFinedayIvivaService service)
//	{
//		_service = service;
//	}

//	public async Task<LogoutResult> Handle(LogoutCommand request, CancellationToken cancellationToken)
//	{
//		var res = await _service.WithLogin().Logout(request.Token);
//		return res;
//	}

//}

