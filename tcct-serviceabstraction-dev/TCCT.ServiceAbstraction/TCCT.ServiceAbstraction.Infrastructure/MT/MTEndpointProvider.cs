
using System.Net.Http.Headers;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using TCCT.ServiceAbstraction.Application.Contracts.MT;
using TCCT.ServiceAbstraction.Domain;
using System.Net;
using System.Text.Json;

namespace TCCT.ServiceAbstraction.Infrastructure.MT;
public partial class MTEndpointProvider(MTConfig config, IHttpClientFactory httpClientFactory) : IMTEndpointProvider
{
	private MTConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;

	public string ConfigEndPoint()
	{
		return _config.EndPoint;
	}
	public string ConfigEndPointCarpark()
	{
		return _config.EndPointCarpark;
	}
	public HttpClient GetClientFromFactory()
	{
		var client = _httpclientfactory.CreateClient("ignoressl");
		client.DefaultRequestHeaders.Add("x-api-key", _config.APIKey);
		return client;
	}

	public async Task<HttpResponseMessage> PostDataAsync(string uri, string jsonData)
	{
		var client = GetClientFromFactory();

		var request = new HttpRequestMessage(HttpMethod.Post, uri)
		{
			Content = new StringContent(jsonData)
		};
		request.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
		request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("*/*"));
		return await client.SendAsync(request);
	}

	public string GetParkingSpaceUrl()
	{
		return $"{_config.EndPoint}/api/parking/spaceNo";
	}
	public string GetTrafficStatusRecordUrl()
	{
		return $"{_config.EndPoint}/api/parking/trafficStatusRecord";
	}
	public string GetParkingQueryUrl()
	{
		return $"{_config.EndPoint}/api/parking/query";
	}
	public string GetValetParkingUrl(string uid, string? query, int? limit, int? page, string? sort, string? reverse)
	{
		return $"{_config.EndPoint}/api/externals/valet-parkings?uid={uid}&query={query}&limit={limit}&page={page}&sort={sort}&reverse={reverse}";
	}
	public string GetValetParkingStationsUrl()
	{
		return $"{_config.EndPoint}/api/externals/valet-parkings/stations";
	}
	public string PatchCallMyValetCarUrl(int valetCarId)
	{
		return $"{_config.EndPoint}/api/externals/valet-parkings/{valetCarId}";
	}
	public string GetParkingDetailByPersonIdUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/GetParkingDetailByPersonID";
	}

	public string PmsCarBlockerUrl()
	{
		return $"{_config.EndPoint}/api/pmsCarBlocker";
	}
	public string UpdateTransactionCarparkUrl()
	{
		return $"{_config.EndPointCarpark}/api/Carpark/updateTransactionCarpark";
	}

	public string ExtCarparkUrl()
	{
		return $"{_config.EndPoint}/api/Carpark/extCarPark";
	}

	public string EntCarparkUrl()
	{
		return $"{_config.EndPoint}/api/Carpark/entCarPark";
	}
}
