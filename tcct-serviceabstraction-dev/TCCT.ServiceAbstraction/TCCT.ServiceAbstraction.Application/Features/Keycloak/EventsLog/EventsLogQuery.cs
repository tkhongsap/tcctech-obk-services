using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.EventsLog;
public class EventsLogQuery : IQuery<List<EventsLogRespones>>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;
	public int Max { get; set; } = 10!;
	public string Type { get; set; } = "LOGIN"!;

	public DateOnly? DateFrom { get; set; }
	public DateOnly? DateTo { get; set; }
	public int? First { get; set; }
	public Guid? User { get; set; }

	public EventsLogQuery(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret, int max, string type, DateOnly? dateFrom, DateOnly? dateTo, int? first, Guid? user)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		Max = max;
		Type = type.Trim().ToUpper();
		DateFrom = dateFrom;
		DateTo = dateTo;
		First = first;
		User = user;
	}
}
