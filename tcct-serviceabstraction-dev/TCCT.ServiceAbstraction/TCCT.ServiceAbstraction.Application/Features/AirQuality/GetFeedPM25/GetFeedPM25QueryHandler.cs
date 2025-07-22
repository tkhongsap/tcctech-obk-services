using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedPM25;

public sealed class GetFeedPM25QueryHandler : IQueryHandler<GetFeedPM25Query, List<GetCalculatedResult>>
{
	private readonly IAlphaXService _alphaxservice;
	public GetFeedPM25QueryHandler(IAlphaXService alphaxservice)
	{
		_alphaxservice = alphaxservice;
	}

	public async Task<List<GetCalculatedResult>> Handle(GetFeedPM25Query request, CancellationToken cancellationToken)
	{
		return await _alphaxservice.GetCalculatedData(request.Building, request.Floor, "PM2.5", request.Status);
	}

}

