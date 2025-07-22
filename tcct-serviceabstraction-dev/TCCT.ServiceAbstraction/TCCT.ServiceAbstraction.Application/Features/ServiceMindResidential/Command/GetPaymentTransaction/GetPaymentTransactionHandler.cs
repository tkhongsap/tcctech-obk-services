using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetPaymentTransaction;
public class GetPaymentTransactionHandler : ICommandHandler<GetPaymentTransactionCommand, GetPaymentTransactionResult>
{
	private readonly IServiceMindResidential _service;
	public GetPaymentTransactionHandler(IServiceMindResidential service)
	{
		_service = service;
	}
	public async Task<GetPaymentTransactionResult> Handle(GetPaymentTransactionCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetPaymentTransaction(request);
	}
}