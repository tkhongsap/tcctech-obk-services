using System.Collections.Generic;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.AirQuality;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Infrastructure.CarparkPayment;

namespace TCCT.ServiceAbstraction.Infrastructure.AlphaX;
public partial class AlphaXEndpointProvider(AirQualityConfig config, IHttpClientFactory httpClientFactory, ILogger<AlphaXEndpointProvider> logger) : IAlphaXEndpointProvider
{
	private AirQualityConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;
	private readonly ILogger<AlphaXEndpointProvider> _logger = logger;

	
	public async Task<List<GetCalculatedResponse>> GetCalculatedData(string building)
	{
		var endpoint = _config.GetSiteEndpoint(building);
		switch (endpoint)
		{
			case null: // null = error
				throw AlphaXServiceException.AXS003;
			case "" or "{secret}": // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data, ใช้ building ในการเลือก Dummy Data
				{
					var data = DummyCUP_CUP_001_DataSource();
					if (string.Equals(building, "T04", StringComparison.OrdinalIgnoreCase)) data = DummyO2_T04_018_019_DataSource();
					return JsonSerializer.Deserialize<List<GetCalculatedResponse>>(data)!;
				}
		}

		var client = _httpclientfactory.CreateClient();
		var httpres = await client.GetAsync(endpoint);
		var body = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode) throw AlphaXServiceException.AXS001;
		return JsonSerializer.Deserialize<List<GetCalculatedResponse>>(body)!;
	}

}
