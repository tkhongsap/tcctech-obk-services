using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.UpdateResidenceMember;

public sealed class UpdateResidenceMemberCommandHandler : ICommandHandler<UpdateResidenceMemberCommand, UpdateResidenceMemberResult>
{
	private readonly IFinedayResidenceService _service;
	public UpdateResidenceMemberCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<UpdateResidenceMemberResult> Handle(UpdateResidenceMemberCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.UpdateResidenceMember(request);
		return res;
	}

}

