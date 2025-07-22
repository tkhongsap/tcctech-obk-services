using System.Net;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Infrastructure.Innoflex;

public class InnoflexServiceBase
{

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		var requestThirdParty = httpres.RequestMessage?.Content == null ? "" : httpres.RequestMessage.Content.ReadAsStringAsync().Result;
		var requestThirdPartyJson = $"request:{requestThirdParty}, response:{resbody}";
		if (!httpres.IsSuccessStatusCode) throw InnoflexException.INF002(requestThirdPartyJson);
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true; 
		return false;
	}
}