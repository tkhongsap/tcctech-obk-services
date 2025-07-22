using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Keycloak;

namespace TCCT.ServiceAbstraction.Infrastructure.Keycloak;
internal class KeycloakRealmService(string authattrname, string clientid, string clientsecret, IMemoryCache cache, IHttpClientFactory httpClientFactory, IKeycloakEndpointProvider endpointprovider, ILoggerFactory loggerFactory) : IKeycloakRealmService
{
	private string _authattrname = authattrname;
	private string _clientid = clientid;
	private string _clientsecret = clientsecret;
	private IMemoryCache _cache = cache;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;
	private IKeycloakEndpointProvider _endpointprovider = endpointprovider;
	private static readonly ILogger<KeycloakRealmService> _logger; 
	private readonly ILoggerFactory _loggerFactory = loggerFactory;
	public IKeycloakRealmAdminService WithRealmAdmin()
	{
		return new KeycloakRealmAdminService(_authattrname, _clientid, _clientsecret, _cache, _httpclientfactory, _endpointprovider, _loggerFactory);
	}

	public static async Task<KeycloakResponse> Login(string clientid, string clientsecret, string username, string password, IHttpClientFactory httpClientFactory, IKeycloakEndpointProvider endpointprovider)
	{
		var endpoint = endpointprovider.GetOpenIDTokenUrl();
		var keyval = new List<KeyValuePair<string, string>>
		{
			new KeyValuePair<string, string>("client_id", clientid),
			new KeyValuePair<string, string>("client_secret", clientsecret),
			new KeyValuePair<string, string>("username", username),
			new KeyValuePair<string, string>("password", password),
			new KeyValuePair<string, string>("grant_type", "password")
		};

		var client = httpClientFactory.CreateClient("ignoressl");
		var req = new HttpRequestMessage(HttpMethod.Post, endpoint) { Content = new FormUrlEncodedContent(keyval) };
		var httpres = await client.SendAsync(req);

		var responseBody = await httpres.Content.ReadAsStringAsync();
		//LoggerService.LogRequestAndResponse(_logger, httpres, responseBody);
		if (httpres.StatusCode == HttpStatusCode.Unauthorized)
		{
			if (responseBody.Contains("Invalid user credentials")) throw KeycloakServiceException.KCS001; //{"error":"invalid_grant","error_description":"Invalid user credentials"}
			throw new ApplicationException(responseBody);
		}
		if (!httpres.IsSuccessStatusCode) throw KeycloakServiceException.KCS003(responseBody);

		return JsonSerializer.Deserialize<KeycloakResponse>(responseBody)!;
	}

	public static async Task<KeycloakResponse> RefreshToken(string clientid, string clientsecret, string refreshToken, IHttpClientFactory httpClientFactory, IKeycloakEndpointProvider endpointprovider)
	{
		var endpoint = endpointprovider.GetOpenIDTokenUrl();

		var keyval = new List<KeyValuePair<string, string>>
		{
			new KeyValuePair<string, string>("client_id", clientid),
			new KeyValuePair<string, string>("client_secret", clientsecret),
			new KeyValuePair<string, string>("refresh_token", refreshToken),
			new KeyValuePair<string, string>("grant_type", "refresh_token")
		};

		var client = httpClientFactory.CreateClient("ignoressl");
		var req = new HttpRequestMessage(HttpMethod.Post, endpoint) { Content = new FormUrlEncodedContent(keyval) };
		var httpres = await client.SendAsync(req);

		var responseBody = await httpres.Content.ReadAsStringAsync();
		//LoggerService.LogRequestAndResponse(_logger, httpres, responseBody);
		if (httpres.StatusCode == HttpStatusCode.Unauthorized)
		{
			if (responseBody.Contains("Invalid user credentials")) throw KeycloakServiceException.KCS001; //{"error":"invalid_grant","error_description":"Invalid user credentials"}
			throw new ApplicationException(responseBody);
		}
		if (!httpres.IsSuccessStatusCode) throw KeycloakServiceException.KCS003(responseBody);

		return JsonSerializer.Deserialize<KeycloakResponse>(responseBody)!;
	}

	/// <summary>
	/// Get access token from keycloak, by grant_type password
	/// </summary>
	/// <param name="username">email or username</param>
	/// <param name="password">password</param>
	/// <returns></returns>
	/// <exception cref="ApplicationException">if not success</exception>
	public async Task<KeycloakResponse> Login(string username, string password)
	{
		return await Login(_clientid, _clientsecret, username, password, _httpclientfactory, _endpointprovider);
	}

	/// <summary>
	/// Get access token from keycloak, by grant_type refresh_token
	/// </summary>
	/// <param name="refreshToken">Refresh token</param>
	/// <returns></returns>
	/// <exception cref="ApplicationException">if not success</exception>
	public async Task<KeycloakResponse> RefreshToken(string refreshToken)
	{
		return await RefreshToken(_clientid, _clientsecret, refreshToken, _httpclientfactory, _endpointprovider);
	}

}
