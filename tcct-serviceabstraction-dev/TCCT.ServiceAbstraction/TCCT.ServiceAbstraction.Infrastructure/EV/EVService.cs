using TCCT.ServiceAbstraction.Application.Contracts.EV;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Register;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Authorize;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SignOut;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlace;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaces;
using System.Text.Json;
using System.Net.Http.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionInit;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStart;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStop;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSession;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSessions;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionAccess;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.Reserve;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserve;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserves;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCancel;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCheck;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoices;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipt;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipts;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.CheckoutInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.CancelInvoice;
using TCCT.ServiceAbstraction.Application.Features.EV.Command.ReceiptRefund;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetPlaceBuilding;
using TCCT.ServiceAbstraction.Application.Features.EV.Query.GetAccount;

namespace TCCT.ServiceAbstraction.Infrastructure.EV;

public class EVService : EVServiceBase, IEVService
{
	IEVEndpointProvider _endpointprovider;
	private readonly ILogger<EVService> _logger;

	public EVService(IEVEndpointProvider endpointProvider, ILogger<EVService> logger)
	{
		_endpointprovider = endpointProvider;
		_logger = logger;
	}

	public async Task<RegisterResult> Register(RegisterCommand req)
	{
		var endpoint = _endpointprovider.RegisterUrl();

		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(req)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, req);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<RegisterResult>(resbody)!;
		return res!;
	}

	public async Task<AuthorizeResult> Authorize(AuthorizeCommand req)
	{
		var endpoint = _endpointprovider.AuthorizeUrl();

		var requestCredential = _endpointprovider.GetMD5Data($"{req.AuthPassword}{req.AuthToken}");
		var request = new
		{
			accid = req.Accid,
			credential = requestCredential
		};
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<AuthorizeResult>(resbody)!;
		return res!;
	}

	public async Task<SignOutResult> SignOut(SignOutCommand req)
	{
		var endpoint = _endpointprovider.SignOutUrl();

		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(new { })));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, req);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<SignOutResult>(resbody)!;
		return res!;
	}


	public async Task<PlaceResult> GetPlace(PlaceQuery req)
	{
		var endpoint = $"{_endpointprovider.GetPlaceUrl()}?uuid={req.uuid}";

		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(new { uuid = req.uuid })));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<PlaceResult>(resbody)!;
		return res!;
	}

	public async Task<PlacesResult> GetPlaces(PlacesQuery req)
	{
		var endpoint = $"{_endpointprovider.GetPlaceUrl()}";
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(""));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<PlacesResult>(resbody)!;
		return res!;
	}

	public async Task<SessionInitResult> SessionInit(SessionInitCommand req)
	{
		var endpoint = _endpointprovider.SessionInitUrl();

		var request = new Dictionary<string, object>
		{
			{ "uuid", req.uuid },
			{ "option", req.option }
		};

		if (req.energy != null) request["energy"] = req.energy;
		if (req.duration != null) request["duration"] = req.duration;
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<SessionInitResult>(resbody)!;
		return res!;
	}

	public async Task<SessionStartResult> SessionStart(SessionStartCommand req)
	{
		var endpoint = _endpointprovider.SessionStartUrl();
		var request = new { uuid = req.uuid };
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<SessionStartResult>(resbody)!;
		return res!;
	}

	public async Task<SessionStopResult> SessionStop(SessionStopCommand req)
	{
		var endpoint = _endpointprovider.SessionStopUrl();
		var request = new { uuid = req.uuid };
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<SessionStopResult>(resbody)!;
		return res!;
	}
	public async Task<GetSessionsResult> GetSessions(GetSessionsQuery req)
	{
		var endpoint = $"{_endpointprovider.GetSessionUrl()}?";
		var request = new Dictionary<string, object>();
		if (!string.IsNullOrEmpty(req.month))
		{
			endpoint += $"month={req.month}&";
			request["month"] = $"{req.month}";
		}

		if (req.pageLast != null)
		{
			endpoint += $"page_last={req.pageLast}&";
			request["page_last"] = $"{req.pageLast}";
		}

		if (req.pageLimit != null)
		{
			endpoint += $"page_limit={req.pageLimit}";
			request["page_limit"] = $"{req.pageLimit}";
		}
		var requestData = JsonSerializer.Serialize(request);
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(requestData == "{}" ? "" : requestData));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetSessionsResult>(resbody)!;
		return res!;
	}

	public async Task<GetSessionResult> GetSession(GetSessionQuery req)
	{
		var endpoint = $"{_endpointprovider.GetSessionUrl()}?uuid={req.uuid}";
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(new { uuid = req.uuid })));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetSessionResult>(resbody)!;
		return res!;
	}

	public async Task<SessionAccessResult> SessionAccess(SessionAccessCommand req)
	{
		var endpoint = _endpointprovider.SessionAccessUrl();

		var request = new
		{
			code = req.code,
		};
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<SessionAccessResult>(resbody)!;
		return res!;
	}

	public async Task<GetReserveResult> GetReserve(GetReserveQuery req)
	{
		var endpoint = $"{_endpointprovider.ReserveUrl()}?uuid={req.uuid}";
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(new { uuid = req.uuid })));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetReserveResult>(resbody)!;
		return res!;
	}
	public async Task<GetReservesResult> GetReserves(GetReservesQuery req)
	{
		var endpoint = $"{_endpointprovider.ReserveUrl()}?";
		var request = new Dictionary<string, object>();
		if (req.status != null)
		{
			endpoint += $"active={req.status}&";
			request["active"] = $"{req.status}";
		}

		if (!string.IsNullOrEmpty(req.month))
		{
			endpoint += $"month={req.month}&";
			request["month"] = $"{req.month}";
		}

		if (req.pageLast != null)
		{
			endpoint += $"page_last={req.pageLast}&";
			request["page_last"] = $"{req.pageLast}";
		}

		if (req.pageLimit != null)
		{
			endpoint += $"page_limit={req.pageLimit}";
			request["page_limit"] = $"{req.pageLimit}";
		}
		var requestData = JsonSerializer.Serialize(request);
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(requestData == "{}" ? "" : requestData));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetReservesResult>(resbody)!;
		return res!;
	}
	public async Task<ReserveResult> Reserve(ReserveCommand req)
	{
		var endpoint = _endpointprovider.ReserveUrl();
		var request = new Dictionary<string, object>
		{
			{ "type", req.type },
			{ "date", req.date },
			{ "time", req.time }
		};

		if (req.place != null) request.Add("place", req.place);
		if (req.building != null) request.Add("building", req.building);

		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<ReserveResult>(resbody)!;
		return res!;
	}

	public async Task<ReserveCancelResult> ReserveCancel(ReserveCancelCommand req)
	{
		var endpoint = _endpointprovider.ReserveCancelUrl();
		var request = new { uuid = req.uuid, reason = req.reason };
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<ReserveCancelResult>(resbody)!;
		return res!;
	}

	public async Task<ReserveCheckResult> ReserveCheck(ReserveCheckCommand req)
	{
		var endpoint = _endpointprovider.ReserveCheckUrl();
		var request = new { uuid = req.uuid };
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<ReserveCheckResult>(resbody)!;
		return res!;
	}

	public async Task<GetInvoiceResult> GetInvoice(GetInvoiceQuery req)
	{
		var endpoint = $"{_endpointprovider.InvoiceUrl()}?uuid={req.uuid}";
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(new { uuid = req.uuid })));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetInvoiceResult>(resbody)!;
		return res!;
	}

	public async Task<GetInvoicesResult> GetInvoices(GetInvoicesQuery req)
	{
		var endpoint = $"{_endpointprovider.InvoiceUrl()}?";
		var request = new Dictionary<string, object>();
		if (!string.IsNullOrEmpty(req.month))
		{
			endpoint += $"month={req.month}&";
			request["month"] = $"{req.month}";
		}

		if (req.pageLast != null)
		{
			endpoint += $"page_last={req.pageLast}&";
			request["page_last"] = $"{req.pageLast}";
		}

		if (req.pageLimit != null)
		{
			endpoint += $"page_limit={req.pageLimit}";
			request["page_limit"] = $"{req.pageLimit}";
		}
		var requestData = JsonSerializer.Serialize(request);
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(requestData == "{}" ? "" : requestData));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetInvoicesResult>(resbody)!;
		return res!;
	}

	public async Task<GetReceiptResult> GetReceipt(GetReceiptQuery req)
	{
		var endpoint = $"{_endpointprovider.ReceiptUrl()}?uuid={req.uuid}";
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(new { uuid = req.uuid })));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetReceiptResult>(resbody)!;
		return res!;
	}

	public async Task<GetReceiptsResult> GetReceipts(GetReceiptsQuery req)
	{
		var endpoint = $"{_endpointprovider.ReceiptUrl()}?";
		var request = new Dictionary<string, object>();
		if (!string.IsNullOrEmpty(req.month))
		{
			endpoint += $"month={req.month}&";
			request["month"] = $"{req.month}";
		}

		if (req.pageLast != null)
		{
			endpoint += $"page_last={req.pageLast}&";
			request["page_last"] = $"{req.pageLast}";
		}

		if (req.pageLimit != null)
		{
			endpoint += $"page_limit={req.pageLimit}";
			request["page_limit"] = $"{req.pageLimit}";
		}
		var requestData = JsonSerializer.Serialize(request);
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(requestData == "{}" ? "" : requestData));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetReceiptsResult>(resbody)!;
		return res!;
	}


	public async Task<CheckoutInvoiceResult> CheckoutInvoice(CheckoutInvoiceCommand req)
	{
		var endpoint = _endpointprovider.InvoiceUrl() + "/checkout";
		var request = new { uuid = req.uuid, tendor = req.tendor, method = req.method };
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<CheckoutInvoiceResult>(resbody)!;
		return res!;
	}

	public async Task<CancelInvoiceResult> CancelInvoice(CancelInvoiceCommand req)
	{
		var endpoint = _endpointprovider.InvoiceUrl() + "/cancel";
		var request = new { uuid = req.uuid, reason = req.reason };
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<CancelInvoiceResult>(resbody)!;
		return res!;
	}

	public async Task<ReceiptRefundResult> ReceiptRefund(ReceiptRefundCommand req)
	{
		var endpoint = _endpointprovider.ReceiptUrl() + "/refund";
		var request = new { uuid = req.uuid, reason = req.reason, @void = req.isVoid };
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.PostAsJsonAsync(endpoint, request);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<ReceiptRefundResult>(resbody)!;
		return res!;
	}

	public async Task<PlaceBuildingResult> GetPlaceBuilding(PlaceBuildingQuery req)
	{
		var endpoint = _endpointprovider.GetPlaceBuildingUrl() + $"?place={req.place}&uuid={req.building}";

		var request = new Dictionary<string, object>()
		{
			{ "place", req.place },
			{ "uuid", req.building }
		};

		if (!string.IsNullOrEmpty(req.date))
		{
			endpoint += $"&date={req.date}";
			request["date"] = $"{req.date}";
		}

		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(JsonSerializer.Serialize(request)));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<PlaceBuildingResult>(resbody)!;
		return res!;
	}

	public async Task<GetAccountResult> GetAccount(GetAccountQuery req)
	{
		var endpoint = _endpointprovider.GetAccountUrl();
		var httpclient = _endpointprovider.GetClientFromFactory();
		httpclient.DefaultRequestHeaders.Add("Cookie", $"acc_token={req.token}");
		httpclient.DefaultRequestHeaders.Add("UC-Credential", _endpointprovider.GetCredentialData(""));
		var httpres = await httpclient.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<GetAccountResult>(resbody)!;
		return res!;	
	}
}
