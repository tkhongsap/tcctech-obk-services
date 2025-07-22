using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDetailResidenceMemberByPersonID;

public sealed class GetDetailResidenceMemberByPersonIDCommandHandler : ICommandHandler<GetDetailResidenceMemberByPersonIDCommand, GetDetailResidenceMemberByPersonIDResult>
{
	private readonly IFinedayResidenceService _service;
	public GetDetailResidenceMemberByPersonIDCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<GetDetailResidenceMemberByPersonIDResult> Handle(GetDetailResidenceMemberByPersonIDCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetDetailResidenceMemberByPersonID(request.personID);
	}

}

