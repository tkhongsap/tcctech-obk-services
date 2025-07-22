using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using RichardSzalay.MockHttp;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedCO2;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetFeedPM25;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Infrastructure.AlphaX;

namespace TCCT.ServiceAbstraction.Testing.Unit.Features.AirQuality;

public class GetFeedTest
{
	[SetUp]
	public void Setup()
	{
	}

	[Test]
	public async Task GetEnvironmentTest()
	{
		var config = new AirQualityConfig
		{
			SiteId = new Dictionary<string, string>
			{
				{ "T04", "http://dummyurl/T04" },
				{ "CUP", "http://dummyurl/CUP" }
			}
		};
		config.SetEnvironmentVariables();
		config.GetEnvironmentVariables();
		Assert.That(config.SiteId["T04"], Is.EqualTo("http://dummyurl/T04"));
		Assert.That(config.SiteId["CUP"], Is.EqualTo("http://dummyurl/CUP"));
	}

	[Test]
	public async Task GetFeedCO2_NoEndPointForTesting()
	{
		var config = new AirQualityConfig
		{
			SiteId = new Dictionary<string, string>
			{
				{ "T04", "" },
				{ "CUP", "" }
			}
		};

		var mockhttpclientfactory = new Mock<IHttpClientFactory>();
		var cache = new AlphaXMemoryCache();
		var endpointprovider = new AlphaXEndpointProvider(config, mockhttpclientfactory.Object, NullLogger<AlphaXEndpointProvider>.Instance);

		var alphxservice = new AlphaXService(cache, endpointprovider);
		var mockhandler = new GetFeedCO2QueryHandler(alphxservice);
		var channel = "CO2";

		{
			var command = new GetFeedCO2Query("T04", "018", "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].floorCode, Is.EqualTo("018"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}

		{
			var command = new GetFeedCO2Query("T04", "019", "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].floorCode, Is.EqualTo("019"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}

		{
			var command = new GetFeedCO2Query("T04", null, "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.GreaterThan(1));
		}

		{
			var command = new GetFeedCO2Query("CUP", null, "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("CUP"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}
	}

	[Test]
	public async Task GetFeedCO2_WithHttpClient()
	{
		var config = new AirQualityConfig
		{
			SiteId = new Dictionary<string, string>
			{
				{ "T04", "xxxx" },
				{ "CUP", "yyyy" }
			},
			EndPoint = "http://dummyurl/test.html?token=dummy"
		};

		var mockhttp = new MockHttpMessageHandler();
		mockhttp.When(config.GetSiteEndpoint("CUP")!).Respond("application/json", AlphaXEndpointProvider.DummyCUP_CUP_001_DataSource());
		mockhttp.When(config.GetSiteEndpoint("T04")!).Respond("application/json", AlphaXEndpointProvider.DummyO2_T04_018_019_DataSource());

		var mockhttpclientfactory = new Mock<IHttpClientFactory>();
		mockhttpclientfactory.Setup(x => x.CreateClient("")).Returns(mockhttp.ToHttpClient());

		var cache = new AlphaXMemoryCache();
		var endpointprovider = new AlphaXEndpointProvider(config, mockhttpclientfactory.Object, NullLogger<AlphaXEndpointProvider>.Instance);

		var alphxservice = new AlphaXService(cache, endpointprovider);
		var mockhandler = new GetFeedCO2QueryHandler(alphxservice);
		const string channel = "CO2";

		{
			var command = new GetFeedCO2Query("T04", "018", "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].floorCode, Is.EqualTo("018"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}

		{
			var command = new GetFeedCO2Query("T04", "019", "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].floorCode, Is.EqualTo("019"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}

		{
			var command = new GetFeedCO2Query("T04", null, "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.GreaterThan(1));
		}
	}

	[Test]
	public async Task GetFeedPM25_ForTestingOrUAT()
	{
		var config = new AirQualityConfig
		{
			SiteId = new Dictionary<string, string>
			{
				{ "T04", "" },
				{ "CUP", "" }
			}
		};

		var mockhttpclientfactory = new Mock<IHttpClientFactory>();
		var cache = new AlphaXMemoryCache();
		var endpointprovider = new AlphaXEndpointProvider(config, mockhttpclientfactory.Object, NullLogger<AlphaXEndpointProvider>.Instance);

		var alphxservice = new AlphaXService(cache, endpointprovider);
		var mockhandler = new GetFeedPM25QueryHandler(alphxservice);
		var channel = "PM2.5";

		{
			var command = new GetFeedPM25Query("T04", "018", "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].floorCode, Is.EqualTo("018"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}

		{
			var command = new GetFeedPM25Query("T04", "019", "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].floorCode, Is.EqualTo("019"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}

		{
			var command = new GetFeedPM25Query("T04", null, "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("T04"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.GreaterThan(1));
		}

		{
			var command = new GetFeedPM25Query("CUP", null, "");
			var actual = await mockhandler.Handle(command, new CancellationToken());

			Assert.That(actual, Is.Not.Null);
			Assert.That(actual[0].buildingCode, Is.EqualTo("CUP"));
			Assert.That(actual[0].channel, Is.EqualTo(channel));

			var buildingcount = actual.GroupBy(x => x.buildingCode).Select(x => x.Key).ToList().Count;
			Assert.That(buildingcount, Is.EqualTo(1));

			var floorcount = actual.GroupBy(x => x.floorCode).Select(x => x.Key).ToList().Count;
			Assert.That(floorcount, Is.EqualTo(1));
		}


	}





}
