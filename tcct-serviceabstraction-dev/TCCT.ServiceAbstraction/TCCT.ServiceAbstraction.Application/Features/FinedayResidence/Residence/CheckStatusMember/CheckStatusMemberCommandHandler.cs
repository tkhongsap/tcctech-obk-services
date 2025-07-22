using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckStatusMember;

public sealed class CheckStatusMemberCommandHandler : ICommandHandler<CheckStatusMemberCommand, CheckStatusMemberResult>
{
	private readonly IFinedayResidenceService _service;
	public CheckStatusMemberCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<CheckStatusMemberResult> Handle(CheckStatusMemberCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.CheckStatusMember(request);
		return res;
	}

}

