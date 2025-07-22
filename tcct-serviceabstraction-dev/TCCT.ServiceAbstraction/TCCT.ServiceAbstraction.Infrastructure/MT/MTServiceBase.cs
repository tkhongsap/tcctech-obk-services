using System.Net;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PatchCallMyValetCar;

namespace TCCT.ServiceAbstraction.Infrastructure.MT;

public class MTServiceBase
{

	protected void ErrorChecking(HttpResponseMessage httpres, string resbody)
	{
		//"{\"status\":400,\"message\":\"[update] invalid body : {\\\"valetCarId\\\":9,\\\"status\\\":\\\"CALLING\\\",\\\"dropOffStationId\\\":2}\"}"

		if (httpres.StatusCode == HttpStatusCode.Unauthorized) throw MTServiceException.MTS003;
		if (httpres.StatusCode == HttpStatusCode.BadRequest)
		{
			if (resbody.Contains("not recognized as a valid DateTime")) throw MTServiceException.MTS005; // invalid date
			if (resbody.Contains("not found")) throw MTServiceException.MTS007("ไม่พบข้อมูล !"); // ไม่พบข้อมูล
			if (resbody.Contains("[update]")){
				var resBodyData = JsonSerializer.Deserialize<PatchCallMyValetCarResult>(resbody)!;
				throw MTServiceException.MTS008(resBodyData.message);
			}
			throw MTServiceException.MTS006; // validation error อื่นๆ
		}
		if (httpres.StatusCode == HttpStatusCode.NotFound) throw MTServiceException.MTS007("ไม่พบข้อมูล !"); // ไม่พบข้อมูล
		if (!httpres.IsSuccessStatusCode) throw MTServiceException.MTS001;
		if (httpres.StatusCode == HttpStatusCode.OK)
		{
			if (resbody.Contains("The required parameter")) throw MTServiceException.MTS003; // invalid date
			if (resbody.Contains("not found")) throw MTServiceException.MTS007("ไม่พบข้อมูล !"); // ไม่พบข้อมูล
			if (resbody.Contains("authentication failed")) throw MTServiceException.MTS003;
		}
	}
	protected bool IsEmptyResult(string resbody)
	{
		if (resbody.Contains("\"status\":1,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":null")) return true;
		if (resbody.Contains("\"status\":0,\"data\":[]")) return true;
		return false;
	}
}