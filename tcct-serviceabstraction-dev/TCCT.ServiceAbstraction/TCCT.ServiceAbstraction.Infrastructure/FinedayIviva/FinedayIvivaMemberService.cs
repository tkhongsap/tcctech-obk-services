using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMemberCarPark;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;

public class FinedayIvivaMemberService(IFinedayIvivaEndpointProvider endpointprovider, ILogger<FinedayIvivaMemberService> logger) : FinedayIvivaServiceBase, IFinedayIvivaMemberService
{
	private readonly IFinedayIvivaEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILogger<FinedayIvivaMemberService> _logger = logger;
	
	public async Task<GetDataMemberResult> GetDataMember(int page, int perpage, string? search, string? startDate, string? endDate, bool active)
	{
		var endpoint = _endpointprovider.GetMemberGetDataMember();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			page,
			perpage,
			search,
			startDate,
			endDate,
			active
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataMemberResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<GetDataMemberResult>>(resbody)!;
		return res.data!;
	}
	public async Task<GetDataMemberCarParkResult> GetDataMemberCarPark(int page, int perpage, string? search, string? startDate, string? endDate, bool active)
	{
		var endpoint = _endpointprovider.GetMemberGetDataMemberCarpark();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			page,
			perpage,
			search,
			startDate,
			endDate,
			active
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataMemberCarParkResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<GetDataMemberCarParkResult>>(resbody)!;
		return res.data!;
	}
}
