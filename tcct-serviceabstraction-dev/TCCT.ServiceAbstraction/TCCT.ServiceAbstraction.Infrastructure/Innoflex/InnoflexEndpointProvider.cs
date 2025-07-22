using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;
using TCCT.ServiceAbstraction.Domain;
using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Infrastructure.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Infrastructure.Innoflex;
public partial class InnoflexEndpointProvider(InnoflexConfig config, IHttpClientFactory httpClientFactory, ILogger<InnoflexEndpointProvider> logger) : IInnoflexEndpointProvider
{
	private InnoflexConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;
	private readonly ILogger<InnoflexEndpointProvider> _logger = logger;
	
	public HttpClient GetClientFromFactory()
	{
		var client = _httpclientfactory.CreateClient("ignoressl");
		return client;
	}
	public async Task<AttendanceLogResult> GetAttendanceLog(AttendanceLogQuery req)
	{
		string url = _config.EndPoint + $"/v1/log/identify";

		if (string.IsNullOrEmpty(_config.EndPoint) || _config.EndPoint == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = req.DeviceKeys[0] == "in" ? GetCheckInJson() : GetCheckOutJson();
			return JsonSerializer.Deserialize<AttendanceLogResult>(dummyData)!;
		}

		var httpres = await GetClientFromFactory().PostAsJsonAsync(url, req);
		var body = await httpres.Content.ReadAsStringAsync();
		//LoggerService.LogRequestAndResponse(_logger, httpres, body);
		if (!httpres.IsSuccessStatusCode) throw InnoflexException.INF001;
		
		return JsonSerializer.Deserialize<AttendanceLogResult>(body)!;
	}

	public string OnboardResidenceUrl()
	{
		return $"{_config.EndPointOnBoard}/v1/residence/onboarding";
	}

	public string RevokeAccessUrl()
	{
		return $"{_config.EndPointOnBoard}/v1/residence/revokeAccess";
	}
}
