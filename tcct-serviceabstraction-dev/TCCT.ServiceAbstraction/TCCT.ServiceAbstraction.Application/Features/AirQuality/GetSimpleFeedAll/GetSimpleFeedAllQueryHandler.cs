using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetSimpleFeedAll;

public sealed class GetSimpleFeedAllQueryHandler : IQueryHandler<GetSimpleFeedAllQuery, List<GetSimpleFeedAllResponse>>
{
	private readonly IAlphaXService _alphaxservice;
	public GetSimpleFeedAllQueryHandler(IAlphaXService alphaxservice)
	{
		_alphaxservice = alphaxservice;
	}

	public async Task<List<GetSimpleFeedAllResponse>> Handle(GetSimpleFeedAllQuery request, CancellationToken cancellationToken)
	{
		return await _alphaxservice.GetSimpleCalculatedData(request.Building, request.Floor, null, request.Status); // null = all sensor types
	}

}

