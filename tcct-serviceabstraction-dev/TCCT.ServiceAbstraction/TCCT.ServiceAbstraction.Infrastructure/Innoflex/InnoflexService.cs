using TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.OnboardResidence;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.RevokeAccess;
using System.Text.Json;
using System.Net.Http.Json;
using Microsoft.Extensions.Logging;

namespace TCCT.ServiceAbstraction.Infrastructure.Innoflex;
public class InnoflexService : InnoflexServiceBase, IInnoflexService
{
	IInnoflexEndpointProvider _endpointprovider;
	private readonly ILogger<InnoflexService> _logger;
	
	public InnoflexService(IInnoflexEndpointProvider endpointProvider, ILogger<InnoflexService> logger)
	{
		_endpointprovider = endpointProvider;
		_logger = logger;
	}

	public async Task<AttendanceLogResult> GetAttendanceLog(AttendanceLogQuery req)
	{
		return await _endpointprovider.GetAttendanceLog(req);
	}

	public async Task<OnboardResidenceResult> OnboardResidence(OnboardResidenceCommand req)
	{
		var endpoint = _endpointprovider.OnboardResidenceUrl();

		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, req);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<OnboardResidenceResult>(resbody)!;
		return res!;
	}

	public async Task<RevokeAccessResult> RevokeAccess(RevokeAccessCommand req)
	{
		var endpoint = _endpointprovider.RevokeAccessUrl();

		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, req);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<RevokeAccessResult>(resbody)!;
		return res!;
	}
}
