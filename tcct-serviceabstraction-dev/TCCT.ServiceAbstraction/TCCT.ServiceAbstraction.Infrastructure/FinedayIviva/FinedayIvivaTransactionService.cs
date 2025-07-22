using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionCarpark;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionTurnstile;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionVisitor;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;

public class FinedayIvivaTransactionService(IFinedayIvivaEndpointProvider endpointprovider, ILogger<FinedayIvivaTransactionService> logger) : FinedayIvivaServiceBase, IFinedayIvivaTransactionService
{
	private readonly IFinedayIvivaEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILogger<FinedayIvivaTransactionService> _logger = logger;
	
	public async Task<GetDataTransactionCarparkResult> GetDataTransactionCarpark(int page, int perPage, string? carNo, string? entryDate, string? exitDate, string? logEntry, int? statusLog, string? terminalEntry, string? ticketNo, int vehicleType)
	{
		var endpoint = _endpointprovider.GetTransactionGetDataTransactionCarpark();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			page,
			perPage,
			carNo,
			entryDate,
			exitDate,
			logEntry,
			statusLog,
			terminalEntry,
			ticketNo,
			vehicleType
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataTransactionCarparkResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<GetDataTransactionCarparkResult>>(resbody)!;
		return res.data!;
	}
	public async Task<GetDataTransactionMemberResult> GetDataTransactionMember(int page, int perpage, string? search, string? startDate, string? endDate)
	{
		var endpoint = _endpointprovider.GetTransactionGetDataTransactionMember();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			page,
			perpage,
			search,
			startDate,
			endDate
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataTransactionMemberResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<GetDataTransactionMemberResult>>(resbody)!;
		return res.data!;
	}
	public async Task<GetDataTransactionVisitorResult> GetDataTransactionVisitor(int page, int perpage, string? search, string? startDate, string? endDate)
	{
		var endpoint = _endpointprovider.GetTransactionGetDataTransactionVisitor();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			page,
			perpage,
			search,
			startDate,
			endDate
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataTransactionVisitorResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<GetDataTransactionVisitorResult>>(resbody)!;
		return res.data!;
	}
	public async Task<GetDataTransactionTurnstileResult> GetDataTransactionTurnstile(int page, int perpage, string? search, string? startDate, string? endDate)
	{
		var endpoint = _endpointprovider.GetTransactionGetDataTransactionTurnstile();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			page,
			perpage,
			search,
			startDate,
			endDate
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataTransactionTurnstileResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<GetDataTransactionTurnstileResult>>(resbody)!;
		return res.data!;
	}









}
