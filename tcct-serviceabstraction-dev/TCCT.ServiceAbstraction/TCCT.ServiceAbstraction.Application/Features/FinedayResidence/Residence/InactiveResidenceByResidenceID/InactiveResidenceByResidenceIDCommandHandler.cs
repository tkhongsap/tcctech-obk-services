using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.InactiveResidenceByResidenceID;

public sealed class InactiveResidenceByResidenceIDCommandHandler : ICommandHandler<InactiveResidenceByResidenceIDCommand, InactiveResidenceByResidenceIDResult>
{
	private readonly IFinedayResidenceService _service;
	public InactiveResidenceByResidenceIDCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<InactiveResidenceByResidenceIDResult> Handle(InactiveResidenceByResidenceIDCommand request, CancellationToken cancellationToken)
	{
		return await _service.InactiveResidenceByResidenceID(request.residenceID);
	}

}

