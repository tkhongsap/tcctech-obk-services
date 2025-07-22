using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceAuthorizeFloorMaster;

public sealed class GetDataResidenceAuthorizeFloorMasterCommandHandler : ICommandHandler<GetDataResidenceAuthorizeFloorMasterCommand, List<GetDataResidenceAuthorizeFloorMasterResult>>
{
	private readonly IFinedayResidenceService _service;
	public GetDataResidenceAuthorizeFloorMasterCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<List<GetDataResidenceAuthorizeFloorMasterResult>> Handle(GetDataResidenceAuthorizeFloorMasterCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.GetDataResidenceAuthorizeFloorMaster(request);
		return res;
	}

}

