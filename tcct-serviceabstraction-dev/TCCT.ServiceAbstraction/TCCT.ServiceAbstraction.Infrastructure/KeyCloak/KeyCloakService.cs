using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Infrastructure.Keycloak;

public class KeycloakService(IMemoryCache cache, IHttpClientFactory httpClientFactory, IKeycloakEndpointProvider endpointprovider, ILoggerFactory loggerFactory) : IKeycloakService
{
	private readonly IMemoryCache _cache = cache;
	private readonly IHttpClientFactory _httpclientfactory = httpClientFactory;
	private readonly IKeycloakEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILoggerFactory _loggerFactory = loggerFactory;

	public IKeycloakRealmService WithRealm(string version, string baseurl, string realm, string authattrname, string clientid, string clientsecret)
	{
		_endpointprovider.SetVersion(version, baseurl, realm);
		return new KeycloakRealmService(authattrname, clientid, clientsecret, _cache, _httpclientfactory, _endpointprovider, _loggerFactory);
	}

}
