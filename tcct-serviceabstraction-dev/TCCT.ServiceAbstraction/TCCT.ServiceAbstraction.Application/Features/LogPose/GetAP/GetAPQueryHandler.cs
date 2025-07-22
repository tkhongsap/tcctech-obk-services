using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.LogPose;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.GetAP;

public sealed class GetAPQueryHandler : IQueryHandler<GetAPQuery, GetAPResult>
{
	private readonly ILogPoseService _service;
	public GetAPQueryHandler(ILogPoseService alphaxservice)
	{
		_service = alphaxservice;
	}

	public async Task<GetAPResult> Handle(GetAPQuery request, CancellationToken cancellationToken)
	{
		//return await _service.GetAP();
		return null;
	}

}

