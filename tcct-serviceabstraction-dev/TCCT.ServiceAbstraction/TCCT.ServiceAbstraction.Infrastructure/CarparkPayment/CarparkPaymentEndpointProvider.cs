using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GetParkingDetail;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.InquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.PromptPayCharge;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.TrueMoneyOnlineCharge;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.AlldataDetailsReceipt;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GenerateReceipt;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva;
using TCCT.ServiceAbstraction.Domain;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Infrastructure.Netatmo;

namespace TCCT.ServiceAbstraction.Infrastructure.CarparkPayment;
public partial class CarparkPaymentEndpointProvider(CarparkPaymentConfig config, IHttpClientFactory httpclientfactory, ILogger<CarparkPaymentEndpointProvider> logger) : ICarparkPaymentEndpointProvider
{
	private CarparkPaymentConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpclientfactory;
	private readonly ILogger<CarparkPaymentEndpointProvider> _logger = logger;
	
	private HttpClient GetArgentoClientFromFactoryWithBearer(string? subCode = null)
	{
		var client = GetClientFromFactory();
		if (subCode != null && subCode == _config.SubCodeONE89Carpark)
		{
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ArgentoPrivateKeyOne89Carpark);
		} else {
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ArgentoPrivateKey);
		}
		return client;
	}
	private HttpClient GetClientFromFactory() => _httpclientfactory.CreateClient("ignoressl");

	private string GetParkingDetailUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/GetParkingDetail";
	}
	private string GetInquiryPaymentTransactionUrl()
	{
		// return "https://ob-cps-payment.fs-omc.io/api/Payment/InquiryPaymentUAT";
		// return $"{_config.ArgentoEndPoint}/api/v1/payment/getTransactionByNo?transactionNo={transactionNo}";
		return $"{_config.EndPoint}/api/Payment/InquiryPayment";
	}
	private string AlldataDetailsReceiptUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/AlldataDetailsReceipt";
	}

	private string GetArgentoPaymentSourceUrl()
	{
		return $"{_config.ArgentoEndPoint}/api/v1/payment/source";
	}
	private string GetArgentoChargePromptPayUrl()
	{
		return $"{_config.ArgentoEndPoint}/api/v1/payment/charge/promptpay";
	}
	private string GetArgentoChargeTrueMoneyOnlineUrl()
	{
		return $"{_config.ArgentoEndPoint}/api/v1/payment/charge/truemoney/online";
	}

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		if (httpres.StatusCode == HttpStatusCode.BadRequest)
		{
			if (resbody.Contains("not recognized as a valid DateTime")) throw CarparkPaymentServiceException.CPS006; // invalid date
			throw CarparkPaymentServiceException.CPS007; // validation error อื่นๆ
		}
		if (httpres.StatusCode == HttpStatusCode.NotFound) return; // ไม่พบข้อมูล
		if (resbody.Contains("QR Exit")) throw CarparkPaymentServiceException.CPS003; // {"message":"QR Exit !","status":1,"data":null,"count":0}
		if (resbody.Contains("ไม่พบข้อมูล")) throw CarparkPaymentServiceException.CPS002; // {"message":"ไม่พบข้อมูล","status":1,"data":null,"count":0}
		if (resbody.Contains("Posted invalid data.")) throw CarparkPaymentServiceException.CPS009; //{"message":"Posted invalid data.","status":1,"data":null,"count":0}
		if (!httpres.IsSuccessStatusCode) throw CarparkPaymentServiceException.CPS001;
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true;
		return false;
	}
	
	public async Task<GetParkingDetailResult> GetParkingDetail(string search, bool lostcard)
	{
		var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

		if (string.IsNullOrEmpty(_config.EndPoint) || _config.EndPoint == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var data = GetParkingDetailJson();
			return JsonSerializer.Deserialize<List<GetParkingDetailResult>>(data, options)![0];
		}

		var endpoint = GetParkingDetailUrl();

		var client = _httpclientfactory.CreateClient("ignoressl");
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			search,
			lostcard
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParkingDetailResult();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<List<GetParkingDetailResult>>>(resbody, options)!;
		return res.data![0];
	}

	public async Task<InquiryPaymentTransactionResult> InquiryPaymentTransaction(string transactionno, string? subCode = null)
	{
		var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

		if (string.IsNullOrEmpty(_config.EndPoint) || _config.EndPoint == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var data = GetInquiryPaymentTransactionJson();

			return JsonSerializer.Deserialize<InquiryPaymentTransactionResult>(data, options)!;
		}

		var endpoint = GetInquiryPaymentTransactionUrl();

		var client = _httpclientfactory.CreateClient("ignoressl");
		var httpres = default(HttpResponseMessage);
		if (subCode != null) {
			httpres = await client.PostAsJsonAsync(endpoint, new { transactionNo = transactionno, subCode });
		} else {
			httpres = await client.PostAsJsonAsync(endpoint, new { transactionNo = transactionno });
		}

		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<InquiryPaymentTransactionResult>(resbody, options)!;
		return res;
	}

	public async Task<ArgentoPaymentSourceResponse> ArgentoPaymentSource(string invoiceNo, string description, decimal amount, string currency, string paymentChannel, string? subCode = null)
	{
		var endpoint = GetArgentoPaymentSourceUrl();

		var client = GetArgentoClientFromFactoryWithBearer(subCode);
		var merchantID = _config.ArgentoMerchantID;
		var httpres = default(HttpResponseMessage);
		var body = new Dictionary<string, object>
		{
			{ "merchantID", merchantID },
			{ "invoiceNo", invoiceNo },
			{ "description", description },
			{ "amount", amount },
			{ "currency", currency },
			{ "paymentChannel", paymentChannel }
		};
		if (subCode != null && subCode == _config.SubCodeONE89Carpark)
		{
			body["merchantID"] = _config.ArgentoMerchantIDOne89Carpark;
			if (!string.IsNullOrEmpty(_config.Ref2One89Carpark) && _config.Ref2One89Carpark != "{secret}") 
			{
				body["merchantRef"] = _config.Ref2One89Carpark;
			}
		}
		httpres = await client.PostAsJsonAsync(endpoint, body);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (httpres.StatusCode == HttpStatusCode.UnprocessableEntity)
		{
			var error = JsonSerializer.Deserialize<ArgentoPaymentSourceFailedResponse>(resbody)!;
			throw CarparkPaymentServiceException.CPS004(error.ToString());
		}
		if (!httpres.IsSuccessStatusCode) throw CarparkPaymentServiceException.CPS005(resbody);
		var res = JsonSerializer.Deserialize<ArgentoPaymentSourceResponse>(resbody)!;
		if (res.respCode != "0000") throw CarparkPaymentServiceException.CPS005(resbody);
		return res;
	}


	public async Task<PromptPayChargeResult> ArgentoChargePromptPay(string description, string sourceId, int qrTimeout, string? subCode = null)
	{
		var endpoint = GetArgentoChargePromptPayUrl();

		var client = GetArgentoClientFromFactoryWithBearer(subCode);
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			description,
			sourceId,
			qrTimeout
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (httpres.StatusCode == HttpStatusCode.UnprocessableEntity)
		{
			var error = JsonSerializer.Deserialize<ArgentoPaymentSourceFailedResponse>(resbody)!;
			throw CarparkPaymentServiceException.CPS004(error.ToString());
		}
		if (!httpres.IsSuccessStatusCode) throw CarparkPaymentServiceException.CPS005(resbody);
		var res = JsonSerializer.Deserialize<PromptPayChargeResult>(resbody)!;
		if (res.respCode != "0000") throw CarparkPaymentServiceException.CPS005(resbody);
		return res;
	}

	public async Task<TrueMoneyOnlineChargeResult> ArgentoChargeTrueMoneyOnline(string description, string sourceId, int qrTimeout, string productImageUrl)
	{
		var endpoint = GetArgentoChargeTrueMoneyOnlineUrl();

		var client = GetArgentoClientFromFactoryWithBearer();
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			description,
			sourceId,
			qrTimeout,
			productImageUrl
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (httpres.StatusCode == HttpStatusCode.UnprocessableEntity)
		{
			var error = JsonSerializer.Deserialize<ArgentoPaymentSourceFailedResponse>(resbody)!;
			throw CarparkPaymentServiceException.CPS004(error.ToString());
		}
		if (!httpres.IsSuccessStatusCode) throw CarparkPaymentServiceException.CPS005(resbody);
		var res = JsonSerializer.Deserialize<TrueMoneyOnlineChargeResult>(resbody)!;
		if (res.respCode != "0000") throw CarparkPaymentServiceException.CPS005(resbody);
		return res;
	}

	public async Task<List<AlldataDetailsReceiptResult>> AlldataDetailsReceipt(string logid)
	{
		var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

		if (string.IsNullOrEmpty(_config.EndPoint) || _config.EndPoint == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var data = AlldataDetailsReceiptJson();
			return JsonSerializer.Deserialize<List<AlldataDetailsReceiptResult>>(data, options)!;
		}

		var endpoint = AlldataDetailsReceiptUrl();

		var client = _httpclientfactory.CreateClient("ignoressl");
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			logid
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<AlldataDetailsReceiptResult>();
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<List<AlldataDetailsReceiptResult>>>(resbody, options)!;
		return res.data!;
	}

}
