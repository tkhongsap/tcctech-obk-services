//using TCCT.ServiceAbstraction.Application.Configuration.Commands;
//using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

//namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.CheckToken;

//public sealed class CheckTokenCommandHandler : ICommandHandler<CheckTokenCommand, CheckTokenResult>
//{
//	private readonly IFinedayIvivaService _service;
//	public CheckTokenCommandHandler(IFinedayIvivaService service)
//	{
//		_service = service;
//	}

//	public async Task<CheckTokenResult> Handle(CheckTokenCommand request, CancellationToken cancellationToken)
//	{
//		var res = await _service.WithLogin().CheckToken(request.Token);
//		return res;
//	}

//}

