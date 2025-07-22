using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Infrastructure.Certis;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;
public partial class FinedayIvivaEndpointProvider(FinedayIvivaConfig config, IFinedayIvivaMemoryCache cache, IHttpClientFactory httpClientFactory, ILogger<FinedayIvivaEndpointProvider> logger) : IFinedayIvivaEndpointProvider
{
	private IFinedayIvivaMemoryCache _cache = cache;
	private FinedayIvivaConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;
	private readonly ILogger<FinedayIvivaEndpointProvider> _logger = logger;
	
	private async Task<LoginResult> GetClientCredential()
	{
		var endpoint = GetLoginLoginUrl();
		Console.WriteLine($"[INFO] Call api: {endpoint}");

		var client = _httpclientfactory.CreateClient("ignoressl");
		Console.WriteLine($"[INFO] send input UserName = {_config.Username}, Password = {_config.Password}");

		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			_config.Username,
			_config.Password
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		Console.WriteLine($"[INFO] Status  = {httpres.StatusCode}");

		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw FinedayIvivaServiceException.FIS002;
		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
		Console.WriteLine($"[INFO] Response Body: {resbody}");

		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<LoginResult>>(resbody)!;
		return res.data!;
	}

	public async Task<HttpClient> GetClientFromFactoryWithBearer()
	{
		var login = await _cache.GetTokenCache(GetClientCredential);

		var client = GetClientFromFactory();
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.token);
		return client;
	}
	public HttpClient GetClientFromFactory() => _httpclientfactory.CreateClient("ignoressl");


	public string GetLoginLoginUrl()
	{
		return $"{_config.EndPoint}/api/Login/Login";
	}
	public string GetLoginLogoutUrl()
	{
		return $"{_config.EndPoint}/api/Login/Logout";
	}
	public string GetLoginCheckTokenUrl()
	{
		return $"{_config.EndPoint}/api/Login/CheckToken";
	}
	public string GetLoginForceLogoutUrl()
	{
		return $"{_config.EndPoint}/api/Login/ForceLogout";
	}
	public string GetLoginTestConnectionUrl()
	{
		return $"{_config.EndPoint}/api/Login/TestConnection";
	}

	public string GetMemberGetDataMember()
	{
		return $"{_config.EndPoint}/api/Member/getDataMember";
	}
	public string GetMemberGetDataMemberCarpark()
	{
		return $"{_config.EndPoint}/api/Member/getDataMemberCarpark";
	}

	public string GetTenantGetDataTenant()
	{
		return $"{_config.EndPoint}/api/Tenant/getDataTenant";
	}

	public string GetTransactionGetDataTransactionCarpark()
	{
		return $"{_config.EndPoint}/api/Transaction/getDataTransactionCarpark";
	}
	public string GetTransactionGetDataTransactionMember()
	{
		return $"{_config.EndPoint}/api/Transaction/getDataTransactionMember";
	}
	public string GetTransactionGetDataTransactionVisitor()
	{
		return $"{_config.EndPoint}/api/Transaction/getDataTransactionVisitor";
	}
	public string GetTransactionGetDataTransactionTurnstile()
	{
		return $"{_config.EndPoint}/api/Transaction/getDataTransactionTurnstile";
	}

}
