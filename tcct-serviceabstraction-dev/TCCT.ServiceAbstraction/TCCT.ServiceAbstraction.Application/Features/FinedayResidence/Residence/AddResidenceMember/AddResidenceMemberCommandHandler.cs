using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidenceMember;

public sealed class AddResidenceMemberCommandHandler : ICommandHandler<AddResidenceMemberCommand, AddResidenceMemberResult>
{
	private readonly IFinedayResidenceService _service;
	public AddResidenceMemberCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<AddResidenceMemberResult> Handle(AddResidenceMemberCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.AddResidenceMember(request);
		return res;
	}

}

