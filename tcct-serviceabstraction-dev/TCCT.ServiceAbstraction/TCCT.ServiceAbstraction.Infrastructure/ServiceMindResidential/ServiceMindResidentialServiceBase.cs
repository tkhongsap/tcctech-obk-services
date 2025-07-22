using System.Net;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Infrastructure.ServiceMindResidential;

public class ServiceMindResidentialServiceBase
{

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (httpres.StatusCode == HttpStatusCode.Unauthorized) throw ServiceMindResidentialServiceException.SMS003(requestThirdPartyJson);
		if (httpres.StatusCode == HttpStatusCode.BadRequest)
		{
			if (resbody.Contains("not recognized as a valid DateTime")) throw ServiceMindResidentialServiceException.SMS005(requestThirdPartyJson); // invalid date
			throw ServiceMindResidentialServiceException.SMS006(requestThirdPartyJson); // validation error อื่นๆ
		}
		if (httpres.StatusCode == HttpStatusCode.NotFound) return; // ไม่พบข้อมูล
		if (!httpres.IsSuccessStatusCode) throw ServiceMindResidentialServiceException.SMS001(requestThirdPartyJson);
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true; 
		return false;
	}
}