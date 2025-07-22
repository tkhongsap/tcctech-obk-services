namespace TCCT.ServiceAbstraction.Application.Contracts.MT;
public interface IMTEndpointProvider
{
	string ConfigEndPoint();
	string ConfigEndPointCarpark();
	HttpClient GetClientFromFactory();
	Task<HttpResponseMessage> PostDataAsync(string uri, string jsonData);
	string GetParkingSpaceUrl();
	string GetTrafficStatusRecordUrl();
	string GetParkingQueryUrl();
	string GetValetParkingUrl(string uid, string? query, int? limit, int? page, string? sort, string? reverse);
	string GetValetParkingStationsUrl();
	string PatchCallMyValetCarUrl(int valetCarId);
	string GetParkingDetailByPersonIdUrl();
	string PmsCarBlockerUrl();
	string UpdateTransactionCarparkUrl();
	string ExtCarparkUrl();
	string EntCarparkUrl();
}
