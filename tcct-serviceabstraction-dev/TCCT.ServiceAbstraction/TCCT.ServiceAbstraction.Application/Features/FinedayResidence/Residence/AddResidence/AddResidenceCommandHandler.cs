using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidence;

public sealed class AddResidenceCommandHandler : ICommandHandler<AddResidenceCommand, AddResidenceResult>
{
	private readonly IFinedayResidenceService _service;
	public AddResidenceCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<AddResidenceResult> Handle(AddResidenceCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.AddResidence(request);
		return res;
	}

}

