using System.Net;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayResidence;

public class FinedayResidenceServiceBase
{

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (httpres.StatusCode == HttpStatusCode.Unauthorized) throw FinedayResidenceServiceException.FRS003(requestThirdPartyJson);
		if (httpres.StatusCode == HttpStatusCode.BadRequest)
		{
			if (resbody.Contains("not recognized as a valid DateTime")) throw FinedayResidenceServiceException.FRS005(requestThirdPartyJson); // invalid date
			if (resbody.Contains("ไม่พบข้อมูล !")) throw FinedayResidenceServiceException.FRS007("ไม่พบข้อมูล !", requestThirdPartyJson); // ไม่พบข้อมูล
			throw FinedayResidenceServiceException.FRS006(requestThirdPartyJson); // validation error อื่นๆ
		}
		if (httpres.StatusCode == HttpStatusCode.NotFound) throw FinedayResidenceServiceException.FRS007("ไม่พบข้อมูล !", requestThirdPartyJson); // ไม่พบข้อมูล
		if (!httpres.IsSuccessStatusCode) throw FinedayResidenceServiceException.FRS001(requestThirdPartyJson);
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true;
		return false;
	}
}