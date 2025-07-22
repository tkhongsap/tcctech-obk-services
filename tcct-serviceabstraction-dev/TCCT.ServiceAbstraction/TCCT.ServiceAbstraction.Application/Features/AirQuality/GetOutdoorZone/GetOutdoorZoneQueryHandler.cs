using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;

namespace TCCT.ServiceAbstraction.Application.Features.AirQuality.GetOutdoorZone;

public sealed class GetOutdoorZoneQueryHandler : IQueryHandler<GetOutdoorZoneQuery, List<GetOutdoorZoneResponse>>
{

	public async Task<List<GetOutdoorZoneResponse>> Handle(GetOutdoorZoneQuery request, CancellationToken cancellationToken)
	{
		var res = new List<GetOutdoorZoneResponse>()
		{
			new GetOutdoorZoneResponse{ Name = "One Bangkok Park", Code = "OUT", Display = new() {EN = "One Bangkok Park", TH = "วัน แบงค็อก ปาร์ค"} },
			new GetOutdoorZoneResponse{ Name = "Wireless Park", Code = "OUT", Display = new() {EN = "Wireless Park", TH = "ไวร์เลส ปาร์ค"} },
			new GetOutdoorZoneResponse{ Name = "Parade Park", Code = "OUT", Display = new() {EN = "Parade Park", TH = "พาเหรด ปาร์ค"} },
			new GetOutdoorZoneResponse{ Name = "Expressway Connection", Code = "OUT", Display = new() {EN = "Expressway Connection", TH = "ทางเชื่อมทางพิเศษ"} },
		};
		return res;
	}

}

