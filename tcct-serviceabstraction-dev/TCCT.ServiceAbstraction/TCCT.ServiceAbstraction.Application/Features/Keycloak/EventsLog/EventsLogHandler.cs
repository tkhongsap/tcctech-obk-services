using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.EventsLog;

public sealed class EventsLogHandler : IQueryHandler<EventsLogQuery, List<EventsLogRespones>>
{
	private readonly IKeycloakService _keycloakservice;
	public EventsLogHandler(IKeycloakService keycloakservice)
	{
		_keycloakservice = keycloakservice;
	}

	public async Task<List<EventsLogRespones>> Handle(EventsLogQuery request, CancellationToken cancellationToken)
	{
		List<EventsLogRespones> res = await _keycloakservice
		.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret)
		.WithRealmAdmin()
		.GetEventLog(request.Max, request.Type, request.DateFrom, request.DateTo, request.First, request.User);

		return res;
	}

}

