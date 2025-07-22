using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;
using TCCT.ServiceAbstraction.Application.Features.Payment;
using TCCT.ServiceAbstraction.Application.Contracts.Payment;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Domain;
using Microsoft.Extensions.Logging;

namespace TCCT.ServiceAbstraction.Infrastructure.Payment;

public partial class PaymentEndpointProvider(PaymentConfig config, IHttpClientFactory httpclientfactory) : IPaymentEndpointProvider
{
	private PaymentConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpclientfactory;

	public async Task<HttpClient> GetArgentoClientFromFactoryWithBearer(string subCode)
	{
		var client = GetClientFromFactory();
		if (subCode != null && subCode == _config.SubCodeOne89EV)
		{
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ArgentoPrivateKeyOne89EV);
		}
		else if (subCode != null && subCode == _config.SubCodeOne89Electric)
		{
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ArgentoPrivateKeyOne89Electric);
		}
		else if (subCode != null && subCode == _config.SubCodeOne89Bill)
		{
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ArgentoPrivateKeyOne89Bill);
		}
		return client;
	}
	public HttpClient GetClientFromFactory() => _httpclientfactory.CreateClient("ignoressl");
	public PaymentConfig GetConfig() => _config;
	public string GetArgentoPaymentTransactionUrl()
	{
		return $"{_config.ArgentoEndPoint}/api/v1/payment/getTransactionByNo";
	}
	public string GetArgentoPaymentSourceUrl()
	{
		return $"{_config.ArgentoEndPoint}/api/v1/payment/source";
	}
	public string GetArgentoChargePromptPayUrl()
	{
		return $"{_config.ArgentoEndPoint}/api/v1/payment/charge/promptpay";
	}
}
