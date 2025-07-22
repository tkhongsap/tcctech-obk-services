using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedAll;

public sealed class GetFeedAllQueryHandler : IQueryHandler<GetFeedAllQuery, List<GetCalculatedResult>>
{
	private readonly IAlphaXService _alphaxservice;
	public GetFeedAllQueryHandler(IAlphaXService alphaxservice)
	{
		_alphaxservice = alphaxservice;
	}

	public async Task<List<GetCalculatedResult>> Handle(GetFeedAllQuery request, CancellationToken cancellationToken)
	{
		return await _alphaxservice.GetCalculatedData(request.Building, request.Floor, null, request.Status); // null = all sensor types
	}

}

