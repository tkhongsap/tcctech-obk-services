using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.MT;
using TCCT.ServiceAbstraction.Application.Features.MT;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingSpace;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetTrafficStatusRecord;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingQuery;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParking;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetValetParkingStations;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PatchCallMyValetCar;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.GetParkingDetailByPersonId;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlocker;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlockerList;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.UpdateTransactionCarpark;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.EntCarpark;
using TCCT.ServiceAbstraction.Application.Features.MT.Parking.ExtCarpark;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Infrastructure.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Infrastructure.MT;

public partial class MTService(IMTEndpointProvider endpointprovider, ILoggerFactory loggerFactory, ILogger<MTService> logger) : MTServiceBase, IMTService
{
	private readonly IMTEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILogger<MTService> _logger = logger;

	
	public async Task<List<GetParkingSpaceResult>> GetParkingSpace(GetParkingSpaceCommand data)
	{
		var endpoint = _endpointprovider.GetParkingSpaceUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetSpaceNoJson();
			var response = JsonSerializer.Deserialize<List<GetParkingSpaceResult>>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.PostDataAsync(endpoint, JsonSerializer.Serialize(data));
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetParkingSpaceResult>();
		var res = JsonSerializer.Deserialize<List<GetParkingSpaceResult>>(resbody)!;
		return res!;
	}

	public async Task<GetTrafficStatusRecordResult> GetTrafficStatusRecord(GetTrafficStatusRecordCommand data)
	{
		var endpoint = _endpointprovider.GetTrafficStatusRecordUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetTrafficStatusJson();
			var response = JsonSerializer.Deserialize<GetTrafficStatusRecordResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.PostDataAsync(endpoint, JsonSerializer.Serialize(data));
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetTrafficStatusRecordResult();
		var res = JsonSerializer.Deserialize<GetTrafficStatusRecordResult>(resbody)!;
		return res!;
	}
	public async Task<GetParkingQueryResult> GetParkingQuery(GetParkingQueryCommand data)
	{
		var endpoint = _endpointprovider.GetParkingQueryUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetQueryJson();
			var response = JsonSerializer.Deserialize<GetParkingQueryResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.PostDataAsync(endpoint, JsonSerializer.Serialize(data));
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParkingQueryResult();
		var res = JsonSerializer.Deserialize<GetParkingQueryResult>(resbody)!;
		return res!;
	}

	public async Task<GetValetParkingResult> GetValetParking(GetValetParkingQuery req)
	{
		var endpoint = _endpointprovider.GetValetParkingUrl(req.Uid, req.Query, req.Limit, req.Page, req.Sort, req.Reverse.ToString().ToLower());
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetValetParkingJson();
			var response = JsonSerializer.Deserialize<GetValetParkingResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetValetParkingResult();
		var res = JsonSerializer.Deserialize<GetValetParkingResult>(resbody)!;
		return res;
	}

	public async Task<List<GetValetParkingStationsResult>> GetValetParkingStations(GetValetParkingStationsQuery data)
	{
		var endpoint = _endpointprovider.GetValetParkingStationsUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetValetParkingStationsJson();
			var response = JsonSerializer.Deserialize<List<GetValetParkingStationsResult>>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetValetParkingStationsResult>();
		var res = JsonSerializer.Deserialize<List<GetValetParkingStationsResult>>(resbody)!;
		return res;
	}
	public async Task<PatchCallMyValetCarResult> PatchCallMyValetCar(PatchCallMyValetCarCommand data)
	{
		var endpoint = _endpointprovider.PatchCallMyValetCarUrl(data.ValetCarId);
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = PatchCallMyValetCarJson();
			var response = JsonSerializer.Deserialize<PatchCallMyValetCarResult>(dummyData)!;
			return response!;
		}
		var req = new PatchCallMyValetCarReq(){
			Status = data.Status,
			DropOffStationId = data.DropOffStationId,
		};
		var httpres = await _endpointprovider.GetClientFromFactory().PatchAsJsonAsync(endpoint, req);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new PatchCallMyValetCarResult();
		var res = JsonSerializer.Deserialize<PatchCallMyValetCarResult>(resbody)!;
		return res;
	}

	public async Task<GetParkingDetailByPersonIdResult> GetParkingDetailByPersonId(Guid personID, bool lostCard)
	{
		var endpoint = _endpointprovider.GetParkingDetailByPersonIdUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetParkingDetailByPersonIdJson();
			var response = JsonSerializer.Deserialize<GetParkingDetailByPersonIdResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, new
		{
			personID,
			lostCard
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParkingDetailByPersonIdResult();
		var res = JsonSerializer.Deserialize<GetParkingDetailByPersonIdResult>(resbody)!;
		return res!;
	}


	public async Task<PmsCarBlockerResult> PmsCarBlocker(PmsCarBlockerCommand data)
	{
		var endpoint = _endpointprovider.PmsCarBlockerUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = PmsCarBlockerJson();
			var response = JsonSerializer.Deserialize<PmsCarBlockerResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new PmsCarBlockerResult();
		var res = JsonSerializer.Deserialize<PmsCarBlockerResult>(resbody)!;
		return res;
	}

	public async Task<List<PmsCarBlockerListResult>> PmsCarBlockerList(PmsCarBlockerListCommand data)
	{
		var endpoint = _endpointprovider.PmsCarBlockerUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPoint()) || (_endpointprovider.ConfigEndPoint() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = PmsCarBlockerListJson();
			var response = JsonSerializer.Deserialize<List<PmsCarBlockerListResult>>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<PmsCarBlockerListResult>();
		var res = JsonSerializer.Deserialize<List<PmsCarBlockerListResult>>(resbody)!;
		return res;
	}

	public async Task<UpdateTransactionCarparkResult> UpdateTransactionCarpark(UpdateTransactionCarparkCommand data)
	{
		var endpoint = _endpointprovider.UpdateTransactionCarparkUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPointCarpark()) || (_endpointprovider.ConfigEndPointCarpark() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = UpdateTransactionCarparkResultJson();
			var response = JsonSerializer.Deserialize<UpdateTransactionCarparkResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new UpdateTransactionCarparkResult();
		var res = JsonSerializer.Deserialize<UpdateTransactionCarparkResult>(resbody)!;
		return res;
	}

	public async Task<EntCarparkResult> EntCarpark(EntCarparkCommand data)
	{
		var endpoint = _endpointprovider.EntCarparkUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPointCarpark()) || (_endpointprovider.ConfigEndPointCarpark() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = EntCarparkResultJson();
			var response = JsonSerializer.Deserialize<EntCarparkResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new EntCarparkResult();
		var res = JsonSerializer.Deserialize<EntCarparkResult>(resbody)!;
		return res;
	}
	public async Task<ExtCarparkResult> ExtCarpark(ExtCarparkCommand data)
	{
		var endpoint = _endpointprovider.ExtCarparkUrl();
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndPointCarpark()) || (_endpointprovider.ConfigEndPointCarpark() == "{secret}")) // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = ExtCarparkResultJson();
			var response = JsonSerializer.Deserialize<ExtCarparkResult>(dummyData)!;
			return response!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new ExtCarparkResult();
		var res = JsonSerializer.Deserialize<ExtCarparkResult>(resbody)!;
		return res;
	}
}
