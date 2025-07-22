//using TCCT.ServiceAbstraction.Application.Configuration.Commands;
//using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

//namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.ForceLogout;

//public sealed class ForceLogoutCommandHandler : ICommandHandler<ForceLogoutCommand, ForceLogoutResult>
//{
//	private readonly IFinedayIvivaService _service;
//	public ForceLogoutCommandHandler(IFinedayIvivaService service)
//	{
//		_service = service;
//	}

//	public async Task<ForceLogoutResult> Handle(ForceLogoutCommand request, CancellationToken cancellationToken)
//	{
//		var res = await _service.WithLogin().ForceLogout(request.userID);
//		return res;
//	}

//}

