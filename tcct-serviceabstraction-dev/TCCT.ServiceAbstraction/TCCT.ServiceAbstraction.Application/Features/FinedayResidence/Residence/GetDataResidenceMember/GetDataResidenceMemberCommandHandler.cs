using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceMember;

public sealed class GetDataResidenceMemberCommandHandler : ICommandHandler<GetDataResidenceMemberCommand, GetDataResidenceMemberResult>
{
	private readonly IFinedayResidenceService _service;
	public GetDataResidenceMemberCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<GetDataResidenceMemberResult> Handle(GetDataResidenceMemberCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.GetDataResidenceMember(request);
		return res;
	}

}

