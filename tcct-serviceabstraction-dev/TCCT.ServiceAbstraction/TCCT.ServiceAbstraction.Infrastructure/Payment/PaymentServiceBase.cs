using System.Net;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Features.Payment;

using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Infrastructure.Payment;

public class PaymentServiceBase
{

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (httpres.StatusCode == HttpStatusCode.UnprocessableEntity)
		{
			var error = JsonSerializer.Deserialize<ArgentoPaymentSourceFailedResponse>(resbody)!;
			throw PaymentServiceException.CPS004(error.ToString(), requestThirdPartyJson);
		}
		if (!httpres.IsSuccessStatusCode) throw PaymentServiceException.CPS005(resbody, requestThirdPartyJson);
		if (httpres.StatusCode == HttpStatusCode.BadRequest)
		{
			if (resbody.Contains("not recognized as a valid DateTime")) throw PaymentServiceException.CPS006(requestThirdPartyJson);
			throw PaymentServiceException.CPS007(requestThirdPartyJson); 
		}
		if (httpres.StatusCode == HttpStatusCode.NotFound) return; 
		if (resbody.Contains("QR Exit")) throw PaymentServiceException.CPS003(requestThirdPartyJson);
		if (resbody.Contains("ไม่พบข้อมูล")) throw PaymentServiceException.CPS002(requestThirdPartyJson);
		if (resbody.Contains("Posted invalid data.")) throw PaymentServiceException.CPS009(requestThirdPartyJson);
		if (!httpres.IsSuccessStatusCode) throw PaymentServiceException.CPS001(requestThirdPartyJson);
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true;
		return false;
	}
}