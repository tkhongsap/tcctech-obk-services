using System.Net.Mime;
using System.Text;
namespace TCCT.ServiceAbstraction.Testing.Unit.Features.AirQuality;

public class GetPPMTest
{
	[SetUp]
	public void Setup()
	{
	}

	[Test]
	public async Task GetPPM_Technicians()
	{
		//https://mozartuat.opsioc.com/ifmmobility/v0.1/ppm/technicians

		var client = new HttpClient();
		client.DefaultRequestHeaders.Add("x-api-key", "60IDtC3WQd4UXnXJGe3pnmJtVxR2rsT5dLc7IS1O2nEK4xZqbWvKHVpwUuSxarnRoS4KoJvj3XO2KTqOMrd2asp0EMAz47qcKl0adEsIksiuPwXpFZTaGGKLCasA26JQ");

		var strjson = "{ \"WoidsCsv\":\"511742\" }";

		var request = new HttpRequestMessage
		{
			Method = HttpMethod.Get,
			RequestUri = new Uri("https://mozartuat.opsioc.com/ifmmobility/v0.1/ppm/technicians"),
			Content = new StringContent(
						strjson,
						Encoding.UTF8,
						MediaTypeNames.Application.Json)
		};

		var response = await client.SendAsync(request);
		response.EnsureSuccessStatusCode();

		var responseBody = await response.Content.ReadAsStringAsync();
		Console.Write("");

	}

}
