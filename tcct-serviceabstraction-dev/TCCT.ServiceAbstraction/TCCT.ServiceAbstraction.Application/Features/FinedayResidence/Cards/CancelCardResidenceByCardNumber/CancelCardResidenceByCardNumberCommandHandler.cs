using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.CancelCardResidenceByCardNumber;

public sealed class CancelCardResidenceByCardNumberCommandHandler : ICommandHandler<CancelCardResidenceByCardNumberCommand, CancelCardResidenceByCardNumberResult>
{
	private readonly IFinedayResidenceService _service;
	public CancelCardResidenceByCardNumberCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<CancelCardResidenceByCardNumberResult> Handle(CancelCardResidenceByCardNumberCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.CancelCardResidenceByCardNumber(request);
		return res;
	}

}

