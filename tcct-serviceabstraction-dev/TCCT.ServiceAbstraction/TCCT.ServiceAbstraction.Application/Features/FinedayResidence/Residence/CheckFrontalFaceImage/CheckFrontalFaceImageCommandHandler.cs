using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckFrontalFaceImage;

public sealed class CheckFrontalFaceImageCommandHandler : ICommandHandler<CheckFrontalFaceImageCommand, CheckFrontalFaceImageResult>
{
	private readonly IFinedayResidenceService _service;
	public CheckFrontalFaceImageCommandHandler(IFinedayResidenceService service)
	{
		_service = service;
	}

	public async Task<CheckFrontalFaceImageResult> Handle(CheckFrontalFaceImageCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.CheckFrontalFaceImage(request);
		return res;
	}

}

