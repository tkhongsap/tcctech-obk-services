using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedCO2;

public sealed class GetFeedCO2QueryHandler : IQueryHandler<GetFeedCO2Query, List<GetCalculatedResult>>
{
	private readonly IAlphaXService _alphaxservice;
	public GetFeedCO2QueryHandler(IAlphaXService alphaxservice)
	{
		_alphaxservice = alphaxservice;
	}

	public async Task<List<GetCalculatedResult>> Handle(GetFeedCO2Query request, CancellationToken cancellationToken)
	{
		return await _alphaxservice.GetCalculatedData(request.Building, request.Floor, "CO2", request.Status);
	}

}

