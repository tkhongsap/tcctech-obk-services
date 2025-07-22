namespace TCCT.ServiceAbstraction.Application.Contracts.EV;

public interface IEVEndpointProvider
{
	HttpClient GetClientFromFactory();
	string RegisterUrl();
	string GetCredentialData(string data);
	string GetMD5Data(string data);
	string AuthorizeUrl();
	string SignOutUrl();
	string GetPlaceUrl();
	string SessionInitUrl();
	string SessionStartUrl();
	string SessionStopUrl();
	string GetSessionUrl();
	string SessionAccessUrl();
	string ReserveUrl();
	string ReserveCancelUrl();
	string ReserveCheckUrl();
	string InvoiceUrl();
	string ReceiptUrl();
	string GetPlaceBuildingUrl();
	string GetAccountUrl();
}

