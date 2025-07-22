using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Domain;
using Microsoft.Extensions.Logging;

namespace TCCT.ServiceAbstraction.Infrastructure.EV;

public partial class EVEndpointProvider(EVConfig config, IHttpClientFactory httpClientFactory, ILogger<EVEndpointProvider> logger) : IEVEndpointProvider
{
	private EVConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;
	private readonly ILogger<EVEndpointProvider> _logger = logger;

	public HttpClient GetClientFromFactory()
	{
		var client = _httpclientfactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Add("UC-Public-Key", _config.PublicKey);
		return client;
	}

	private string ComputeHash(string data, bool includePrivateKey = false)
	{
		using var md5 = System.Security.Cryptography.MD5.Create();
		var input = includePrivateKey ? data + _config.PrivateKey : data;
		var inputBytes = System.Text.Encoding.UTF8.GetBytes(input);
		var hashBytes = md5.ComputeHash(inputBytes);
		return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
	}

	public string GetMD5Data(string data)
	{
		return ComputeHash(data);
	}

	public string GetCredentialData(string data)
	{
		return ComputeHash(data, true);
	}

	public string RegisterUrl()
	{
		return $"{_config.EndPoint}/api/v1/register";
	}

	public string AuthorizeUrl()
	{
		return $"{_config.EndPoint}/api/v1/authorize";
	}

	public string SignOutUrl()
	{
		return $"{_config.EndPoint}/api/v1/signout";
	}

	public string GetPlaceUrl()
	{
		return $"{_config.EndPoint}/api/v1/place";
	}

	public string SessionInitUrl()
	{
		return $"{_config.EndPoint}/api/v1/charging/session/init";
	}

	public string SessionStartUrl()
	{
		return $"{_config.EndPoint}/api/v1/charging/session/start";
	}
	public string SessionStopUrl()
	{
		return $"{_config.EndPoint}/api/v1/charging/session/stop";
	}
	public string GetSessionUrl()
	{
		return $"{_config.EndPoint}/api/v1/charging/session";
	}
	public string SessionAccessUrl()
	{
		return $"{_config.EndPoint}/api/v1/access";
	}

	public string ReserveUrl()
	{
		return $"{_config.EndPoint}/api/v1/reserve";
	}

	public string ReserveCancelUrl()
	{
		return $"{_config.EndPoint}/api/v1/reserve/cancel";
	}

	public string ReserveCheckUrl()
	{
		return $"{_config.EndPoint}/api/v1/reserve/checked";
	}

	public string InvoiceUrl()
	{
		return $"{_config.EndPoint}/api/v1/document/invoice";
	}

	public string ReceiptUrl()
	{
		return $"{_config.EndPoint}/api/v1/document/receipt";
	}

	public string GetPlaceBuildingUrl()
	{
		return $"{_config.EndPoint}/api/v1/place/building";
	}

	public string GetAccountUrl()
	{
		return $"{_config.EndPoint}/api/v1/account";
	}
}
