using System.Collections.Generic;
using System.Text.Json;

namespace TCCT.ServiceAbstraction.Domain;
public class AirQualityConfig
{
	public Dictionary<string, string> SiteId { get; set; } = new();
	public string EndPoint { get; set; } = null!;

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("AIRQUALITY_SITEID", JsonSerializer.Serialize(SiteId));
		Environment.SetEnvironmentVariable("AIRQUALITY_ENDPOINT", EndPoint);
	}

	public void GetEnvironmentVariables()
	{
		var siteConfig = Environment.GetEnvironmentVariable("AIRQUALITY_SITEID")!;
		EndPoint = Environment.GetEnvironmentVariable("AIRQUALITY_ENDPOINT")!;
		SiteId = JsonSerializer.Deserialize<Dictionary<string, string>>(siteConfig)!;
	}

	public string? GetSiteEndpoint(string building)
	{
		if (string.IsNullOrEmpty(EndPoint)) return ""; // ไม่มี endpoint อาจจะเป็น UAT environment หรือไม่ได้ใส่ endpoint ใน config

		var b = building.ToUpper();
		if (!SiteId.TryGetValue(b, out var siteid)) return null; // error, ข้างนอกจะ handle ด้วย exception เอง
		return EndPoint + $"&siteid={siteid}";
	}
}
