using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetActiveFloor;

public sealed class GetActiveFloorQueryHandler : IQueryHandler<GetActiveFloorQuery, GetActiveFloorResponse>
{
	private readonly IAlphaXService _alphaxservice;
	public GetActiveFloorQueryHandler(IAlphaXService alphaxservice)
	{
		_alphaxservice = alphaxservice;
	}

	public async Task<GetActiveFloorResponse> Handle(GetActiveFloorQuery request, CancellationToken cancellationToken)
	{
		return await _alphaxservice.GetActiveFloor(request.Building);
	}

}

