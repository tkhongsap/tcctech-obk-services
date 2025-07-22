using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
using TCCT.ServiceAbstraction.Application.Exceptions;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;
using TCCT.ServiceAbstraction.Domain;
using TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.MinioImageResponse;
using TCCT.ServiceAbstraction.Application.Contracts;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayResidence;
public partial class FinedayResidenceEndpointProvider(FinedayResidenceConfig config, IFinedayResidenceMemoryCache cache, IHttpClientFactory httpClientFactory, ILogger<FinedayIvivaEndpointProvider> logger, IRedisService redisService) : IFinedayResidenceEndpointProvider
{
	private IFinedayResidenceMemoryCache _cache = cache;
	private FinedayResidenceConfig _config = config;
	private IHttpClientFactory _httpclientfactory = httpClientFactory;
	private readonly ILogger<FinedayIvivaEndpointProvider> _logger = logger;
	private IRedisService _redisService = redisService;
	string keyCacheToken = "roomBookingImage";
	
	private async Task<LoginResult> GetClientCredential()
	{
		var endpoint = GetLoginLoginUrl();

		var client = _httpclientfactory.CreateClient("ignoressl");
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			_config.Username,
			_config.Password
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw FinedayIvivaServiceException.FIS002;
		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
		var res = JsonSerializer.Deserialize<FinedayIvivaResponse<LoginResult>>(resbody)!;
		return res.data!;
	}

	public async Task<HttpClient> GetClientFromFactoryWithBearer()
	{
		var login = await _cache.GetTokenCache(GetClientCredential);

		var client = GetClientFromFactory();
		client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", login.token);
		client.DefaultRequestHeaders.Add("fs-user-id", login.user_ID.ToString());
		return client;
	}
	public HttpClient GetClientFromFactory() => _httpclientfactory.CreateClient("ignoressl");


	public string GetLoginLoginUrl()
	{
		return $"{_config.EndPoint}/api/Login/LoginFineDay";
	}
	public string GetDataResidenceMember()
	{
		return $"{_config.EndPoint}/api/Residence/getDataResidenceMember";
	}
	public string AddResidence()
	{
		return $"{_config.EndPoint}/api/Residence/addResidence";
	}
	public string AddResidenceMember()
	{
		return $"{_config.EndPoint}/api/Residence/addResidenceMember";
	}
	public string CheckFrontalFaceImage()
	{
		return $"{_config.EndPoint}/api/Residence/checkFrontalFaceImage";
	}
	public string UpdateResidenceMember()
	{
		return $"{_config.EndPoint}/api/Residence/updateResidenceMember";
	}
	public string CheckStatusMember()
	{
		return $"{_config.EndPoint}/api/Residence/checkStatusMember";
	}
	public string ChangeDefaultFloor()
	{
		return $"{_config.EndPoint}/api/AuthorizeFloor/changeDefaultFloor";
	}
	public string GetResidenceLocationMapping()
	{
		return $"{_config.EndPoint}/api/AuthorizeFloor/getResidenceLocationMapping";
	}

	public string GetCardsAccessGroups()
	{
		return $"{_config.EndPoint}/api/Card/getCardsAccessGroups";
	}
	public string GetParkingDetailByQRCode()
	{
		return $"{_config.EndPoint}/api/Carpark/GetParkingDetailByQRCode";
	}
	public string GetParkingDetail()
	{
		return $"{_config.EndPoint}/api/Carpark/GetParkingDetail";
	}
	public string GetParkingDetailByPersonId()
	{
		return $"{_config.EndPoint}/api/Carpark/GetParkingDetailByPersonId";
	}
	public string InviteResidenceVisitor()
	{
		return $"{_config.EndPoint}/api/PreRegister/inviteResidenceVisitor";
	}

	public string CancelInviteResidenceVisitor()
	{
		return $"{_config.EndPoint}/api/PreRegister/cancelInviteResidenceVisitor";
	}
	public string GetDataInviteVisitorTransaction()
	{
		return $"{_config.EndPoint}/api/PreRegister/getDataInviteVisitorTransaction";
	}
	public string RedeemParking()
	{
		return $"{_config.EndPoint}/api/Redemption/RedeemParking";
	}

	public string GetDataRateCodeListByTenantID()
	{
		return $"{_config.EndPoint}/api/Redemption/GetDataRateCodeListByTenantID";
	}

	public string UpdateResidence()
	{
		return $"{_config.EndPoint}/api/Residence/updateResidence";
	}

	public string InactiveResidenceByResidenceID()
	{
		return $"{_config.EndPoint}/api/Residence/InactiveResidenceByResidenceID";
	}

	public string GetDetailResidenceMemberByPersonIDUrl()
	{
		return $"{_config.EndPoint}/api/Residence/getDetailResidenceMemberByPersonID";
	}

	public string InactiveResidenceByResidenceIDUrl()
	{
		return $"{_config.EndPoint}/api/Residence/InactiveResidenceByResidenceID";
	}

	public string GetQueueCallLiftUrl()
	{
		return $"{_config.EndPoint}/api/AuthorizeFloor/getQueueLift";
	}
	public string SetApproveInviteResidenceVisitorUrl()
	{
		return $"{_config.EndPoint}/api/PreRegister/setApproveInviteResidenceVisitor";
	}

	public string GetDataResidenceAuthorizeFloorMasterUrl()
	{
		return $"{_config.EndPoint}/api/Residence/getDataResidenceAuthorizeFloorMaster";
	}

	public string GetDataVehicleTypeUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/GetDataVehicleType";
	}

	public string GetDataMemberTypeUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/GetDataMemberType";
	}

	public string GetDataTerminalUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/GetDataTerminal";
	}

	public string GetDataDepartmentUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/GetDataDepartment";
	}

	public string GetMasServiceTypeUrl()
	{
		return $"{_config.EndPoint}/api/Residence/getMasServiceType";
	}
	public string CancelCardResidenceByCardNumberUrl()
	{
		return $"{_config.EndPoint}/api/Card/cancelResidenceCardByCardnumber";
	}

	public string GetDataResidenceCardByPersonIdUrl()
	{
		return $"{_config.EndPoint}/api/Card/getDataResidenceCardByPersonID";
	}

	public string CheckPreRegisterIsPassUrl()
	{
		return $"{_config.EndPoint}/api/PreRegister/checkPreRegisterIsPass";
	}

	public string CheckRedemptionStatusByEmailUrl()
	{
		return $"{_config.EndPoint}/api/Redemption/CheckRedemptionStatusByEmail";
	}

	public string ConfigEndpointBooking()
	{
		return _config.EndPointBooking;
	}

	public string ReservationSearchQueryUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/query";
	}
	public string GetReservationByIDUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/GetReservationByID";
	}
	public string ReservationCreateUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/ReservationCreate";
	}
	public string ReservationUpdateUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/ReservationUpdate";
	}
	public string GetFacilitiesUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/GetFacilities";
	}
	public string FacilitiesUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/facility";
	}
	public string ReservationFacilitiesCreateUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/eventlog/reserve/fac";
	}
	public string ReservationFacilitiesUpdateUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/eventlog/reserve";
	}
	public string ReservationSearchFacilitiesQueryUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/eventlog/reserve/query";
	}
	public string GetReservationFacilitiesByIDUrl()
	{
		return $"{_config.EndPointBooking}/api/authkey/eventlog/reserve";
	}

	private async Task<List<MinioImageResponse>> GetImageUrl()
	{
		var endpoint = $"{_config.OperationEndpoint}/api/v1/common/GetImageData?ImageList={_config.MinioConfig}";

		var client = _httpclientfactory.CreateClient("ignoressl");
		var httpres = await client.GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		if (httpres.StatusCode == HttpStatusCode.BadRequest) throw FinedayIvivaServiceException.FIS002;
		if (!httpres.IsSuccessStatusCode) throw FinedayIvivaServiceException.FIS001;
		var res = JsonSerializer.Deserialize<List<MinioImageResponse>>(resbody)!;
		return res!;
	}

	public async Task<List<MinioImageResponse>> GetImageMinioUrl()
	{
		var cacheDataRoom = await _redisService.GetCacheAsync(keyCacheToken);
		var cacheData = cacheDataRoom == null ? null : JsonSerializer.Deserialize<List<MinioImageResponse>>(cacheDataRoom);
		if (cacheData == null) {
			var data = await GetImageUrl();
			cacheData = data;
			await _redisService.SetCacheAsync(keyCacheToken, JsonSerializer.Serialize(cacheData), TimeSpan.FromMinutes(1440 - 10));
		}

		return cacheData!;
	}

	public string CheckQueueLiftUrl()
	{
		return $"{_config.EndPoint}/api/AuthorizeFloor/checkQueueLift";
	}
}
