using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.LogPose;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.GetAPDistance;

public sealed class GetAPDistanceQueryHandler : IQueryHandler<GetAPDistanceQuery, GetAPDistanceResult>
{
	private readonly ILogPoseService _service;
	public GetAPDistanceQueryHandler(ILogPoseService alphaxservice)
	{
		_service = alphaxservice;
	}

	public async Task<GetAPDistanceResult> Handle(GetAPDistanceQuery request, CancellationToken cancellationToken)
	{
		//return await _service.GetAPDistance(request.Items);
		return null;
	}

}

