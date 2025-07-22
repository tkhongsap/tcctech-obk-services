using System.Net;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;

public class FinedayIvivaServiceBase
{

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		if (httpres.StatusCode == HttpStatusCode.Unauthorized) throw FinedayIvivaServiceException.FIS003;
		if (httpres.StatusCode == HttpStatusCode.BadRequest)
		{
			if (resbody.Contains("not recognized as a valid DateTime")) throw FinedayIvivaServiceException.FIS005; // invalid date
			throw FinedayIvivaServiceException.FIS006; // validation error อื่นๆ
		}
		if (httpres.StatusCode == HttpStatusCode.NotFound) return; // ไม่พบข้อมูล
		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true;
		return false;
	}
}