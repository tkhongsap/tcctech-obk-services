using System.Text.Json;
using System.Text.Json.Serialization;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.LogPose;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.QueryPosition;

public sealed class QueryPositionQueryHandler : IQueryHandler<QueryPositionQuery, QueryPositionResult>
{
	private readonly ILogPoseService _service;
	public QueryPositionQueryHandler(ILogPoseService alphaxservice)
	{
		_service = alphaxservice;
	}

	public async Task<QueryPositionResult> Handle(QueryPositionQuery request, CancellationToken cancellationToken)
	{
		//if (request.AppName == "LBS" || request.AppName == "string")
		if (request.AppName == "LBS")
		{
			if (request.TestMode == "1") // Test mode ส่งอะไรมาก็ส่งกลับ
			{
				var r = new QueryPositionResult();
				r.Accuracy = 100;
				r.Lng = request.TestLng;
				r.Lat = request.TestLat;
				r.Floor = request.TestFloor;
				r.Building = request.TestBuilding;
				return r;
			}

			if (string.IsNullOrEmpty(request.WifiJson)) throw LogPoseServiceException.LPS001;

			//var json = File.ReadAllText(@"C:\Users\Memepuppy\Dropbox\0.The island digital\20.TCC\2.IndoorNavigation\wifi\875\a_57b56254-24ff-4cd6-8dd7-8e668631fcbd.json");
			//var lbswifiscans = JsonSerializer.Deserialize<List<LBSWifiScan>>(json)!;
			try
			{
				var lbswifiscans = JsonSerializer.Deserialize<List<LBSWifiScan>>(request.WifiJson)!;
				return await _service.QueryPosition(lbswifiscans, request.TestMode);
			}
			catch (JsonException)
			{
				throw LogPoseServiceException.LPS002;
			}
		}
		else
		{
			var res = new QueryPositionResult();
			res.Accuracy = 10.5;
			res.Lng = 100.546279440235;
			res.Lat = 13.726098033992884;
			res.Floor = "b1";
			res.Building = "r1";
			return res;
		}



	}

}

