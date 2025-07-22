using System.Net;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Infrastructure.EV;

public class EVServiceBase
{

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (httpres.StatusCode == HttpStatusCode.BadRequest)
		{
			if (resbody.Contains("Duplicated account")) throw EVException.EV003(requestThirdPartyJson); 
			throw EVException.EV002(requestThirdPartyJson); // validation error อื่นๆ
		}
		if (httpres.StatusCode == HttpStatusCode.Unauthorized)
		{
			throw EVException.EV004(requestThirdPartyJson); 
		}
		if (httpres.StatusCode == HttpStatusCode.Forbidden)
		{
			throw EVException.EV005(requestThirdPartyJson); 
		}
		if (!httpres.IsSuccessStatusCode) throw EVException.EV002(requestThirdPartyJson);
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true; 
		return false;
	}
}

