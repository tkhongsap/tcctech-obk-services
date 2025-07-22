using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetDataResidenceCardByPersonId;

public sealed class GetDataResidenceCardByPersonIdHandler : ICommandHandler<GetDataResidenceCardByPersonIdCommand, List<GetDataResidenceCardByPersonIdResult>>
{
	private readonly IFinedayResidenceService _service;
	public GetDataResidenceCardByPersonIdHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<List<GetDataResidenceCardByPersonIdResult>> Handle(GetDataResidenceCardByPersonIdCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.GetDataResidenceCardByPersonId(request);
		return res;
	}

}

