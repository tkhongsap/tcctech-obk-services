//using Moq;
//using Newtonsoft.Json;
//using TCCT.ServiceAbstraction.Application.Features.LogPose.GetAPDistance;
//using TCCT.ServiceAbstraction.Domain.LogPose;
//using TCCT.ServiceAbstraction.Infrastructure.LogPose;

//namespace TCCT.ServiceAbstraction.Testing.Unit.Features.AirQuality;

//public class GetAPDistanceTest
//{
//	[SetUp]
//	public void Setup()
//	{
//	}

//	[Test]
//	public async Task T001_NormalCase()
//	{
//		var mockhttpclientfactory = new Mock<IHttpClientFactory>();

//		var service = new LogPoseService(mockhttpclientfactory.Object);
//		var mockhandler = new GetAPDistanceQueryHandler(service);

//		{
//			var testitem = new List<WifiScanModel>
//			{
//				new WifiScanModel { level = -73.0f, frequency = 5785.0f, BSSID = "78cf2f553f40", SSID = "OBK" },
//				new WifiScanModel { level = -61.0f, frequency = 5700.0f, BSSID = "78cf2f6bd310", SSID = "OBK" },
//				new WifiScanModel { level = -77.0f, frequency = 2412.0f, BSSID = "78cf2f6bd3e0", SSID = "OBK" },
//				new WifiScanModel { level = -65.0f, frequency = 5220.0f, BSSID = "78cf2f6bd3f0", SSID = "OBK" },
//				new WifiScanModel { level = -79.0f, frequency = 2462.0f, BSSID = "78cf2f6bd420", SSID = "OBK" },
//				new WifiScanModel { level = -74.0f, frequency = 5785.0f, BSSID = "78cf2f6bd430", SSID = "OBK" },
//				new WifiScanModel { level = -84.0f, frequency = 2462.0f, BSSID = "78cf2f6bd440", SSID = "OBK" },
//				new WifiScanModel { level = -79.0f, frequency = 5180.0f, BSSID = "78cf2f6bd450", SSID = "OBK" },
//				new WifiScanModel { level = -61.0f, frequency = 2412.0f, BSSID = "78cf2f6bd480", SSID = "OBK" },
//				new WifiScanModel { level = -84.0f, frequency = 2437.0f, BSSID = "78cf2f6bd520", SSID = "OBK" },
//				new WifiScanModel { level = -72.0f, frequency = 5660.0f, BSSID = "78cf2f6bd530", SSID = "OBK" },
//				new WifiScanModel { level = -48.0f, frequency = 2462.0f, BSSID = "78cf2f6bd580", SSID = "OBK" },
//				new WifiScanModel { level = -49.0f, frequency = 5745.0f, BSSID = "78cf2f6bd590", SSID = "OBK" },
//				new WifiScanModel { level = -81.0f, frequency = 2437.0f, BSSID = "78cf2f6bd620", SSID = "OBK" },
//				new WifiScanModel { level = -80.0f, frequency = 5540.0f, BSSID = "78cf2f6bd630", SSID = "OBK" },
//				new WifiScanModel { level = -83.0f, frequency = 5540.0f, BSSID = "78cf2f6bd6b0", SSID = "OBK" }
//			};

//			var command = new GetAPDistanceQuery(testitem);
//			var actual = await mockhandler.Handle(command, new CancellationToken());


//			var item1 = actual.Items.Where(x => x.Frequency > 4000).OrderBy(x => x.Distance).ToList();
//			var item2 = actual.Items.Where(x => x.Frequency < 4000).OrderBy(x => x.Distance).ToList();

//			var ss1 = JsonConvert.SerializeObject(item1);
//			var ss2 = JsonConvert.SerializeObject(item2);
//			Console.WriteLine("");


//		}

//	}

//}
