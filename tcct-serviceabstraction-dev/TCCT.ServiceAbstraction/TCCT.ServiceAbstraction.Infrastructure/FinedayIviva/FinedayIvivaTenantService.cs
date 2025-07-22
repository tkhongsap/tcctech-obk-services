using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Tenant.GetDataTenant;
using TCCT.ServiceAbstraction.Infrastructure.MT;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;

public class FinedayIvivaTenantService(IFinedayIvivaEndpointProvider endpointprovider, ILogger<FinedayIvivaTenantService> logger) : FinedayIvivaServiceBase, IFinedayIvivaTenantService
{
	private readonly IFinedayIvivaEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILogger<FinedayIvivaTenantService> _logger = logger;
	

	public async Task<GetDataTenantResult> GetDataTenant(string? search, string? startdate, string? enddate, bool active)
	{
		var endpoint = _endpointprovider.GetTenantGetDataTenant();
			var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			search,
			startdate,
			enddate,
			active
		});

		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataTenantResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<GetDataTenantResult>>(resbody)!;
		return res.data!;
	}

}
