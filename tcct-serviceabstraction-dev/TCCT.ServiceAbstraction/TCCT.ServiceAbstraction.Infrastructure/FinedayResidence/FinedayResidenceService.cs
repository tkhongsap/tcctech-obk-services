using System.Net.Http.Json;
using System.Text.Json;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidence;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.AddResidenceMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckFrontalFaceImage;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.UpdateResidenceMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.CheckStatusMember;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.ChangeDefaultFloor;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetCardsAccessGroups;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.LocationMapping.GetResidenceLocationMapping;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByQRCode;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetail;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.Invite;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.GetDataInviteVisitorTransaction;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.RedeemParking;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataRateCodeListByTenantID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDetailResidenceMemberByPersonID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.InactiveResidenceByResidenceID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.GetQueueCallLift;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.SetApproveInviteResidenceVisitor;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetDataResidenceAuthorizeFloorMaster;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataDepartment;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataMemberType;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataTerminal;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.GetDataVehicleType;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Residence.GetMasServiceType;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetFacilities;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchQuery;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationCreate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationByID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationUpdate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.Models;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByPersonId;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.CancelCardResidenceByCardNumber;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Cards.GetDataResidenceCardByPersonId;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;
using Microsoft.Extensions.Logging;
using TCCT.ServiceAbstraction.Infrastructure.MT;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Redemption.CheckRedemptionStatusByEmail;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.Facilities;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesUpdate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationFacilitiesCreate;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.GetReservationFacilitiesByID;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.ReservationSearchFacilitiesQuery;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetPropertieDetails;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Booking.Models;
using TCCT.ServiceAbstraction.Application.Features.MinioImageResponse;
using TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.CheckQueueLift;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayResidence;

public partial class FinedayResidenceService(IFinedayResidenceEndpointProvider endpointprovider, ILogger<FinedayResidenceService> logger) : FinedayResidenceServiceBase, IFinedayResidenceService
{
	private readonly IFinedayResidenceEndpointProvider _endpointprovider = endpointprovider;
	private readonly ILogger<FinedayResidenceService> _logger = logger;
	
	public async Task<AddResidenceResult> AddResidence(AddResidenceCommand data)
	{
		var endpoint = _endpointprovider.AddResidence();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new AddResidenceResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<AddResidenceResult>>(resbody)!;
		return res.data!;
	}

	public async Task<AddResidenceMemberResult> AddResidenceMember(AddResidenceMemberCommand data)
	{
		var endpoint = _endpointprovider.AddResidenceMember();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new AddResidenceMemberResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<AddResidenceMemberResult>>(resbody)!;
		return res.data!;
	}

	public async Task<CheckFrontalFaceImageResult> CheckFrontalFaceImage(CheckFrontalFaceImageCommand data)
	{
		var endpoint = _endpointprovider.CheckFrontalFaceImage();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CheckFrontalFaceImageResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<CheckFrontalFaceImageResult>>(resbody)!;
		return res.data!;
	}

	public async Task<UpdateResidenceMemberResult> UpdateResidenceMember(UpdateResidenceMemberCommand data)
	{
		var endpoint = _endpointprovider.UpdateResidenceMember();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new UpdateResidenceMemberResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<UpdateResidenceMemberResult>>(resbody)!;
		return res.data!;
	}

	public async Task<GetDataResidenceMemberResult> GetDataResidenceMember(GetDataResidenceMemberCommand data)
	{
		var endpoint = _endpointprovider.GetDataResidenceMember();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataResidenceMemberResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<GetDataResidenceMemberResult>>(resbody)!;
		return res.data!;
	}

	public async Task<CheckStatusMemberResult> CheckStatusMember(CheckStatusMemberCommand data)
	{
		var endpoint = _endpointprovider.CheckStatusMember();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CheckStatusMemberResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<CheckStatusMemberResult>>(resbody)!;
		return res.data!;
	}
	public async Task<ChangeDefaultFloorResult> ChangeDefaultFloor(int floorID, int zoneID, Guid personID)
	{
		var endpoint = _endpointprovider.ChangeDefaultFloor();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			floorID,
			zoneID,
			personID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new ChangeDefaultFloorResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<ChangeDefaultFloorResult>>(resbody)!;
		return res.data!;
	}
	public async Task<List<GetResidenceLocationMappingResult>> GetResidenceLocationMapping(int zoneID, int floorID)
	{
		var endpoint = _endpointprovider.GetResidenceLocationMapping();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			zoneID,
			floorID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetResidenceLocationMappingResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<List<GetResidenceLocationMappingResult>>>(resbody)!;
		return res.data!;
	}
	public async Task<List<GetCardsAccessGroupsResult>> GetCardsAccessGroups()
	{
		var endpoint = _endpointprovider.GetCardsAccessGroups();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetCardsAccessGroupsResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<List<GetCardsAccessGroupsResult>>>(resbody)!;
		return res.data!;
	}
	public async Task<GetParkingDetailByQRCodeResult> GetParkingDetailByQRCode(string logCarparkID, bool lostCard)
	{
		var endpoint = _endpointprovider.GetParkingDetailByQRCode();
		var client = await _endpointprovider.GetClientFromFactoryWithBearer();
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			logCarparkID,
			lostCard
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParkingDetailByQRCodeResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<GetParkingDetailByQRCodeResult>>(resbody)!;
		if (int.TryParse(client.DefaultRequestHeaders.GetValues("fs-user-id").FirstOrDefault(), out var userId))
		{
			res.data!.userId = userId;
		}
		return res.data!;
	}
	public async Task<GetParkingDetailResult> GetParkingDetail(string search, bool lostCard)
	{
		var endpoint = _endpointprovider.GetParkingDetail();
		var client = await _endpointprovider.GetClientFromFactoryWithBearer();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			search,
			lostCard
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParkingDetailResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<GetParkingDetailResult>>(resbody)!;
		if (int.TryParse(client.DefaultRequestHeaders.GetValues("fs-user-id").FirstOrDefault(), out var userId))
		{
			res.data!.userId = userId;
		}
		return res.data!;
	}

	public async Task<GetParkingDetailByPersonIdResult> GetParkingDetailByPersonId(Guid personID, bool lostCard)
	{
		var endpoint = _endpointprovider.GetParkingDetailByPersonId();
		var client = await _endpointprovider.GetClientFromFactoryWithBearer();
		var httpres = await client.PostAsJsonAsync(endpoint, new
		{
			personID,
			lostCard
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetParkingDetailByPersonIdResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<GetParkingDetailByPersonIdResult>>(resbody)!;
		if (int.TryParse(client.DefaultRequestHeaders.GetValues("fs-user-id").FirstOrDefault(), out var userId))
		{
			res.data!.userId = userId;
		}
		return res.data!;
	}

	public async Task<CancelInviteResidenceVisitorResult> CancelInviteResidenceVisitor(Guid inviteID, Guid personID)
	{
		var endpoint = _endpointprovider.CancelInviteResidenceVisitor();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			inviteID,
			personID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<CancelInviteResidenceVisitorResult>(resbody)!;
		return res!;
	}

	public async Task<GetDataInviteVisitorTransactionResult> GetDataInviteVisitorTransaction(Guid personID)
	{
		var endpoint = _endpointprovider.GetDataInviteVisitorTransaction();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			personID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDataInviteVisitorTransactionResult();
		var res = JsonSerializer.Deserialize<GetDataInviteVisitorTransactionResult>(resbody)!;
		return res!;
	}

	public async Task<RedeemParkingResult> RedeemParking(string logCarparkID, int terminalID, string datetimeIn, string runningNumber, string plateNumber, int memberType, int carType, int tenantID, int rateCode, int userID, string remark)
	{
		var endpoint = _endpointprovider.RedeemParking();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			logCarparkID,
			terminalID,
			datetimeIn,
			runningNumber,
			plateNumber,
			memberType,
			carType,
			tenantID,
			rateCode,
			userID,
			remark
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new RedeemParkingResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<RedeemParkingResult>>(resbody)!;
		return res.data!;
	}

	public async Task<List<GetDataRateCodeListByTenantIDResult>> GetDataRateCodeListByTenantID(int tenantID, int memberType, int vehicleType, int departmentID)
	{
		var endpoint = _endpointprovider.GetDataRateCodeListByTenantID();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			tenantID,
			memberType,
			vehicleType,
			departmentID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDataRateCodeListByTenantIDResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<List<GetDataRateCodeListByTenantIDResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<InviteResidenceVisitorResult> InviteResidenceVisitor(string guestInviteName, int residenceID, int locationID, Guid personID, List<InviteSchedule> inviteSchedule)
	{
		var endpoint = _endpointprovider.InviteResidenceVisitor();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			guestInviteName,
			residenceID,
			locationID,
			personID,
			inviteSchedule
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new InviteResidenceVisitorResult();
		var res = JsonSerializer.Deserialize<InviteResidenceVisitorResult>(resbody)!;
		return res!;
	}

	public async Task<GetDetailResidenceMemberByPersonIDResult> GetDetailResidenceMemberByPersonID(Guid personID)
	{
		var endpoint = _endpointprovider.GetDetailResidenceMemberByPersonIDUrl();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			personID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetDetailResidenceMemberByPersonIDResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<GetDetailResidenceMemberByPersonIDResult>>(resbody)!;
		return res.data!;
	}

	public async Task<InactiveResidenceByResidenceIDResult> InactiveResidenceByResidenceID(int residenceID)
	{
		var endpoint = _endpointprovider.InactiveResidenceByResidenceIDUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			residenceID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new InactiveResidenceByResidenceIDResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<InactiveResidenceByResidenceIDResult>>(resbody)!;
		return res.data!;
	}

	public async Task<GetQueueCallLiftResult> GetQueueCallLift(GetQueueCallLiftCommand data)
	{
		var endpoint = _endpointprovider.GetQueueCallLiftUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetQueueCallLiftResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<GetQueueCallLiftResult>>(resbody)!;
		return res.data!;
	}

	public async Task<SetApproveInviteResidenceVisitorResult> SetApproveInviteResidenceVisitor(SetApproveInviteResidenceVisitorCommand data)
	{
		var endpoint = _endpointprovider.SetApproveInviteResidenceVisitorUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new SetApproveInviteResidenceVisitorResult();
		var res = JsonSerializer.Deserialize<SetApproveInviteResidenceVisitorResult>(resbody)!;
		return res!;
	}

	public async Task<List<ReservationSearchQueryResult>> ReservationSearchQuery(ReservationSearchQuery data)
	{
		var endpoint = _endpointprovider.ReservationSearchQueryUrl() + $"?start={data.Start}&end={data.End}";
		if (data.Title != null) {
			endpoint = $"{endpoint}&title={data.Title}";
		}
		if (data.Facilities != null) {
			endpoint = $"{endpoint}&facilities={data.Facilities}";
		}
		if (data.Status != null) {
			endpoint = $"{endpoint}&status={data.Status}";
		}
		if (data.Organizer != null) {
			endpoint = $"{endpoint}&organizer={data.Organizer}";
		}
		if (data.Hasdetails != null) {
			endpoint = $"{endpoint}&hasdetails={data.Hasdetails}";
		}

		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndpointBooking()) || _endpointprovider.ConfigEndpointBooking() == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetReservationSearchQueryJson();
			var dummy = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<ReservationSearchQueryResult>>>(dummyData)!;
			return dummy.data;
		}

		var httpres = await(_endpointprovider.GetClientFromFactory()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, "");
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<ReservationSearchQueryResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<ReservationSearchQueryResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<GetReservationByIDResult> GetReservationByID(string reserveId)
	{
		var endpoint = _endpointprovider.GetReservationByIDUrl() + $"/{reserveId}";
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndpointBooking()) || _endpointprovider.ConfigEndpointBooking() == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetReservationByIDJson();
			var dummy = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<GetReservationByIDResult>>(dummyData)!;
			return dummy.data;
		}
		var httpres = await(_endpointprovider.GetClientFromFactory()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetReservationByIDResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<GetReservationByIDResult>>(resbody)!;
		return res.data!;
	}

	public async Task<ReservationCreateResult> ReservationCreate(string reserveId, ReservationCreateCommand data)
	{
		var endpoint = _endpointprovider.ReservationCreateUrl() + $"/{reserveId}";
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndpointBooking()) || _endpointprovider.ConfigEndpointBooking() == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = ReservationCreateJson();
			return JsonSerializer.Deserialize<ReservationCreateResult>(dummyData)!;
		}
		var httpres = await(_endpointprovider.GetClientFromFactory()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new ReservationCreateResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<ReservationCreateResult>>(resbody)!;
		return res.data!;
	}

	public async Task<ReservationUpdateResult> ReservationUpdate(string reserveId, ReservationUpdateCommand data)
	{
		var endpoint = _endpointprovider.ReservationUpdateUrl() + $"/{reserveId}";
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndpointBooking()) || _endpointprovider.ConfigEndpointBooking() == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = ReservationUpdateJson();
			var dummy = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<ReservationUpdateResult>>(dummyData)!;
			return dummy.data!;
		}

		var requestDelete = new ReservationDelete();
		bool isDeleted = false;
		if (data.deleted != null && data.status == null) {
			isDeleted = true;
		    requestDelete.deleted = data.deleted;
		} 

		var client = _endpointprovider.GetClientFromFactory();
		var httpres =  isDeleted? await client.PatchAsJsonAsync(endpoint, requestDelete): await client.PatchAsJsonAsync(endpoint, data);;
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new ReservationUpdateResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<ReservationUpdateResult>>(resbody)!;
		return res.data!;
	}

	public async Task<GetFacilitiesResult> GetFacilities(GetFacilitiesQuery data)
	{
		var endpoint = _endpointprovider.GetFacilitiesUrl() + $"?page={data.Page}&limit={data.Limit}&types={data.Types}";
		if (string.IsNullOrEmpty(_endpointprovider.ConfigEndpointBooking()) || _endpointprovider.ConfigEndpointBooking() == "{secret}") // ถ้าไม่ใส่ endpoint ให้ใช้ข้อมูลจาก Dummy Data
		{
			var dummyData = GetFacilitiesJson();
			var dummy = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<GetFacilitiesResult>>(dummyData)!;
			return dummy.data!;
		}
		var httpres = await _endpointprovider.GetClientFromFactory().GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, "");
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetFacilitiesResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<GetFacilitiesResult>>(resbody)!;
		return res.data!;
	}

	public async Task<List<GetDataResidenceAuthorizeFloorMasterResult>> GetDataResidenceAuthorizeFloorMaster(GetDataResidenceAuthorizeFloorMasterCommand data) 
	{
		var endpoint = _endpointprovider.GetDataResidenceAuthorizeFloorMasterUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			residenceID = data.ResidenceID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDataResidenceAuthorizeFloorMasterResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<GetDataResidenceAuthorizeFloorMasterResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<List<GetDataVehicleTypeResult>> GetDataVehicleType(GetDataVehicleTypeQuery data) 
	{
		var endpoint = _endpointprovider.GetDataVehicleTypeUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDataVehicleTypeResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<GetDataVehicleTypeResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<List<GetDataDepartmentResult>> GetDataDepartment(GetDataDepartmentQuery data) 
	{
		var endpoint = _endpointprovider.GetDataDepartmentUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDataDepartmentResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<GetDataDepartmentResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<List<GetDataTerminalResult>> GetDataTerminal(GetDataTerminalQuery data) 
	{
		var endpoint = _endpointprovider.GetDataTerminalUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDataTerminalResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<GetDataTerminalResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<List<GetMasServiceTypeResult>> GetMasServiceType(GetMasServiceTypeQuery data) 
	{
		var endpoint = _endpointprovider.GetMasServiceTypeUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetMasServiceTypeResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<GetMasServiceTypeResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<List<GetDataMemberTypeResult>> GetDataMemberType(GetDataMemberTypeQuery data)
	{
		var endpoint = _endpointprovider.GetDataMemberTypeUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDataMemberTypeResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<GetDataMemberTypeResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<CancelCardResidenceByCardNumberResult> CancelCardResidenceByCardNumber(CancelCardResidenceByCardNumberCommand data)
	{
		var endpoint = _endpointprovider.CancelCardResidenceByCardNumberUrl();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			data.CardNumber
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		var res = JsonSerializer.Deserialize<CancelCardResidenceByCardNumberResult>(resbody)!;
		return res!;
	}

	public async Task<List<GetDataResidenceCardByPersonIdResult>> GetDataResidenceCardByPersonId(GetDataResidenceCardByPersonIdCommand data)
	{
		var endpoint = _endpointprovider.GetDataResidenceCardByPersonIdUrl();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new
		{
			data.PersonID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new List<GetDataResidenceCardByPersonIdResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<List<GetDataResidenceCardByPersonIdResult>>>(resbody)!;
		return res.data!;
	}

	public async Task<CheckPreRegisterIsPassResult> CheckPreRegisterIsPass(CheckPreRegisterIsPassCommand data)
	{
		var endpoint = _endpointprovider.CheckPreRegisterIsPassUrl();
		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, new {
			data.InviteID
		});
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CheckPreRegisterIsPassResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<CheckPreRegisterIsPassResult>>(resbody)!;
		return res.data!;
	}

	public async Task<CheckRedemptionStatusByEmailResult> CheckRedemptionStatusByEmail(CheckRedemptionStatusByEmailCommand data)
	{
		var endpoint = _endpointprovider.CheckRedemptionStatusByEmailUrl();

		var httpres = await (await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CheckRedemptionStatusByEmailResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<CheckRedemptionStatusByEmailResult>>(resbody)!;
		return res.data!;
	}

	public async Task<FacilitiesResult> Facilities(FacilitiesQuery data)
	{
		var endpoint = _endpointprovider.FacilitiesUrl() + $"?page={data.Page}&limit={data.Limit}&types={data.Types}";
		if (data.Tower != null) endpoint += $"&tower={data.Tower}";
		if (data.ResidenceId != null) endpoint += $"&residenceId={data.ResidenceId}";

		var httpres = await _endpointprovider.GetClientFromFactory().GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, "");
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new FacilitiesResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<FacilitiesResult>>(resbody)!;
		return res.data!;
	}

	public async Task<ReservationFacilitiesCreateResult> ReservationFacilitiesCreate(string reserveId, ReservationFacilitiesCreateCommand data)
	{
		var endpoint = _endpointprovider.ReservationFacilitiesCreateUrl() + $"/{reserveId}";
		var httpres = await(_endpointprovider.GetClientFromFactory()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new ReservationFacilitiesCreateResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<ReservationFacilitiesCreateResult>>(resbody)!;
		return res.data!;
	}

	public async Task<ReservationFacilitiesUpdateResult> ReservationFacilitiesUpdate(string reserveId, ReservationFacilitiesUpdateCommand data)
	{
		var endpoint = _endpointprovider.ReservationFacilitiesUpdateUrl() + $"/{reserveId}";

		var client = _endpointprovider.GetClientFromFactory();
		var httpres =  await client.PatchAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new ReservationFacilitiesUpdateResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<ReservationFacilitiesUpdateResult>>(resbody)!;
		return res.data!;
	}

	public async Task<List<ReservationSearchFacilitiesQueryResult>> ReservationSearchFacilitiesQuery(ReservationSearchFacilitiesQuery data)
	{
		var endpoint = BuildReservationSearchFacilitiesQueryEndpoint(data);
		var requestBody = BuildReservationSearchFacilitiesQueryRequestBody(data);

		var client = _endpointprovider.GetClientFromFactory();
		var resbody = await SendRequestAsync(client, endpoint, requestBody);

		if (IsEmptyResult(resbody)) return new List<ReservationSearchFacilitiesQueryResult>();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<ReservationSearchFacilitiesQueryResult>>>(resbody)!;
		return res.data!;
	}

	private string BuildReservationSearchFacilitiesQueryEndpoint(ReservationSearchFacilitiesQuery data)
	{
		var endpoint = _endpointprovider.ReservationSearchFacilitiesQueryUrl() + $"?start={data.Start}&end={data.End}";
		if (data.Title != null) endpoint += $"&title={data.Title}";
		if (data.Facilities != null) endpoint += $"&facilities={data.Facilities}";
		if (data.Status != null) endpoint += $"&status={data.Status}";
		if (data.Organizer != null) endpoint += $"&organizer={data.Organizer}";
		if (data.Hasdetails != null) endpoint += $"&hasdetails={data.Hasdetails}";
		if (data.ResidenceId != null) endpoint += $"&residenceId={data.ResidenceId}";
		return endpoint;
	}

	private Dictionary<string, object>? BuildReservationSearchFacilitiesQueryRequestBody(ReservationSearchFacilitiesQuery data)
	{
		var requestBody = new Dictionary<string, object>();
		if (data.Page != null) requestBody["Page"] = data.Page;
		if (data.Perpage != null) requestBody["Perpage"] = data.Perpage;
		if (data.History != null) requestBody["History"] = data.History;
		if (data.ResidenceId != null) requestBody["ResidenceId"] = data.ResidenceId;

		return requestBody.Count > 0 ? requestBody : null;
	}

	private async Task<string> SendRequestAsync(HttpClient client, string endpoint, Dictionary<string, object>? requestBody)
	{
		HttpResponseMessage httpres;
		if (requestBody != null)
		{
			var request = new HttpRequestMessage(HttpMethod.Get, endpoint)
			{
				Content = new StringContent(JsonSerializer.Serialize(requestBody))
			};
			httpres = await client.SendAsync(request);
		}
		else
		{
			httpres = await client.GetAsync(endpoint);
		}

		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, "");
		ErrorChecking(httpres, resbody);
		return resbody;
	}

	public async Task<GetReservationFacilitiesByIDResult> GetReservationFacilitiesByID(string reserveId)
	{
		var endpoint = _endpointprovider.GetReservationFacilitiesByIDUrl() + $"/{reserveId}";
		var httpres = await(_endpointprovider.GetClientFromFactory()).GetAsync(endpoint);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new GetReservationFacilitiesByIDResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<GetReservationFacilitiesByIDResult>>(resbody)!;
		return res.data!;
	}

	public async Task<List<MinioImageResponse>> GetImageUrl()
	{
		return await _endpointprovider.GetImageMinioUrl();
	}

	public async Task<CheckQueueLiftResult> CheckQueueLift(CheckQueueLiftCommand data)
	{
		var endpoint = _endpointprovider.CheckQueueLiftUrl();
		var httpres = await(await _endpointprovider.GetClientFromFactoryWithBearer()).PostAsJsonAsync(endpoint, data);
		var resbody = await httpres.Content.ReadAsStringAsync();
		LoggerService.LogRequestAndResponse(_logger, httpres, resbody);
		ErrorChecking(httpres, resbody);
		if (IsEmptyResult(resbody)) return new CheckQueueLiftResult();
		var res = JsonSerializer.Deserialize<FinedayResidenceResponse<CheckQueueLiftResult>>(resbody)!;
		return res.data!;
	}

	public async Task<int?> ReservationSearchFacilitiesQueryCount(ReservationSearchFacilitiesQuery data)
	{
		var endpoint = BuildReservationSearchFacilitiesQueryEndpoint(data);
		var requestBody = BuildReservationSearchFacilitiesQueryRequestBody(data);

		var client = _endpointprovider.GetClientFromFactory();
		var resbody = await SendRequestAsync(client, endpoint, requestBody);

		if (IsEmptyResult(resbody)) return 0;
		var res = JsonSerializer.Deserialize<FinedayResidenceBookingResponse<List<ReservationSearchFacilitiesQueryResult>>>(resbody)!;
		return res.total!;
	}
}
