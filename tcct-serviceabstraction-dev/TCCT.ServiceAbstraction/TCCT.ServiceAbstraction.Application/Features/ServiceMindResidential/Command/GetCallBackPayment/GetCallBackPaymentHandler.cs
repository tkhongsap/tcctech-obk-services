using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetCallBackPayment;
public class GetCallBackPaymentHandler : ICommandHandler<GetCallBackPaymentCommand, GetCallBackPaymentResult>
{
	private readonly IServiceMindResidential _service;
	public GetCallBackPaymentHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetCallBackPaymentResult> Handle(GetCallBackPaymentCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetCallBackPayment(request);
	}
}