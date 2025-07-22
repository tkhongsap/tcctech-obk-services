using TCCT.ServiceAbstraction.Application.Features.Payment;
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;
using TCCT.ServiceAbstraction.Application.Contracts.Payment;
using System.Text.Json;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Application.Exceptions;
using System.Net.Http.Json;

namespace TCCT.ServiceAbstraction.Infrastructure.Payment;

public class PaymentService(IPaymentEndpointProvider endpointprovider) : PaymentServiceBase, IPaymentService
{
	private readonly IPaymentEndpointProvider _endpointprovider = endpointprovider;
    private readonly PaymentConfig _config = endpointprovider.GetConfig();

	public async Task<ArgentoInquiryPaymentTransactionResult> ArgentoInquiryPaymentTransaction(string transactionno, string subCode)
	{
		var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

		var endpoint = _endpointprovider.GetArgentoPaymentTransactionUrl() + $"?transactionNo={transactionno}";

		var client = await _endpointprovider.GetArgentoClientFromFactoryWithBearer(subCode);
		var merchantID = "";
		var httpres = default(HttpResponseMessage);
		httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<ArgentoInquiryPaymentTransactionResult>(resbody, options)!;
		return res;
	}

	public async Task<ArgentoPaymentSourceResponse> ArgentoPaymentSource(string invoiceNo, string description, decimal amount, string currency, string paymentChannel, string subCode)
	{
		var endpoint = _endpointprovider.GetArgentoPaymentSourceUrl();

		var client = await _endpointprovider.GetArgentoClientFromFactoryWithBearer(subCode);
		var merchantID = "";
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
		if (subCode != null && subCode == _config.SubCodeOne89EV)
		{
			body["merchantID"] = _config.ArgentoMerchantIDOne89EV;
			if (!string.IsNullOrEmpty(_config.Ref2One89EV) && _config.Ref2One89EV != "{secret}")
			{
				body["merchantRef"] = _config.Ref2One89EV;
			}
		}
		else if (subCode != null && subCode == _config.SubCodeOne89Electric)
		{
			body["merchantID"] = _config.ArgentoMerchantIDOne89Electric;
			if (!string.IsNullOrEmpty(_config.Ref2One89Electric) && _config.Ref2One89Electric != "{secret}")
			{
				body["merchantRef"] = _config.Ref2One89Electric;
			}
		}
		else if (subCode != null && subCode == _config.SubCodeOne89Bill)
		{
			body["merchantID"] = _config.ArgentoMerchantIDOne89Bill;
			if (!string.IsNullOrEmpty(_config.Ref2One89Bill) && _config.Ref2One89Bill != "{secret}")
			{
				body["merchantRef"] = _config.Ref2One89Bill;
			}
		}
		httpres = await client.PostAsJsonAsync(endpoint, body);
		var resbody = await httpres.Content.ReadAsStringAsync();
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<ArgentoPaymentSourceResponse>(resbody)!;
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (res.respCode != "0000") throw PaymentServiceException.CPS005(resbody, requestThirdPartyJson);
		return res;
	}
	public async Task<ArgentoPromptPayChargeResult> ArgentoChargePromptPay(string description, string sourceId, int qrTimeout, string? subCode = null)
	{
		var endpoint = _endpointprovider.GetArgentoChargePromptPayUrl();

		var client = await _endpointprovider.GetArgentoClientFromFactoryWithBearer(subCode);
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			description,
			sourceId,
			qrTimeout
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<ArgentoPromptPayChargeResult>(resbody)!;
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (res.respCode != "0000") throw PaymentServiceException.CPS005(resbody, requestThirdPartyJson);
		return res;
	}
}
