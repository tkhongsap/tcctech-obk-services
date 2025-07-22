using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedTemperature;

public sealed class GetFeedTemperatureQueryHandler : IQueryHandler<GetFeedTemperatureQuery, List<GetCalculatedResult>>
{
	private readonly IAlphaXService _alphaxservice;
	public GetFeedTemperatureQueryHandler(IAlphaXService alphaxservice)
	{
		_alphaxservice = alphaxservice;
	}

	public async Task<List<GetCalculatedResult>> Handle(GetFeedTemperatureQuery request, CancellationToken cancellationToken)
	{
		return await _alphaxservice.GetCalculatedData(request.Building, request.Floor, "Temperature", request.Status);
	}

}

