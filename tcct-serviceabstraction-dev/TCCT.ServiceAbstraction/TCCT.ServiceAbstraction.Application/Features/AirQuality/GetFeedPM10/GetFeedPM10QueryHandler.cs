using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedPM10;

public sealed class GetFeedPM10QueryHandler : IQueryHandler<GetFeedPM10Query, List<GetCalculatedResult>>
{
	private readonly IAlphaXService _alphaxservice;
	public GetFeedPM10QueryHandler(IAlphaXService alphaxservice)
	{
		_alphaxservice = alphaxservice;
	}

	public async Task<List<GetCalculatedResult>> Handle(GetFeedPM10Query request, CancellationToken cancellationToken)
	{
		return await _alphaxservice.GetCalculatedData(request.Building, request.Floor, "PM10", request.Status);
	}

}

