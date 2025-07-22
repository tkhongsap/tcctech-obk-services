using TCCT.ServiceAbstraction.Application.Features.MinioImageResponse;

namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;
public interface IFinedayResidenceEndpointProvider
{
	HttpClient GetClientFromFactory();
	Task<HttpClient> GetClientFromFactoryWithBearer();

	string GetDataResidenceMember();
	string AddResidence();
	string AddResidenceMember();
	string CheckFrontalFaceImage();
	string UpdateResidenceMember();
	string CheckStatusMember();
	string ChangeDefaultFloor();
	string GetResidenceLocationMapping();
	string GetCardsAccessGroups();
	string GetParkingDetailByQRCode();
	string GetParkingDetail();
	string GetParkingDetailByPersonId();
	string InviteResidenceVisitor();
	string GetDataInviteVisitorTransaction();
	string RedeemParking();
	string GetDataRateCodeListByTenantID();
	string UpdateResidence();
	string InactiveResidenceByResidenceID();
	string CancelInviteResidenceVisitor();
	string GetDetailResidenceMemberByPersonIDUrl();
	string InactiveResidenceByResidenceIDUrl();
	string GetQueueCallLiftUrl();
	string SetApproveInviteResidenceVisitorUrl();
	string GetDataResidenceAuthorizeFloorMasterUrl();
	string ConfigEndpointBooking();
	string ReservationSearchQueryUrl();
	string GetReservationByIDUrl();
	string ReservationCreateUrl();
	string ReservationUpdateUrl();
	string GetFacilitiesUrl();
	string GetDataVehicleTypeUrl();
	string GetDataMemberTypeUrl();
	string GetDataTerminalUrl();
	string GetDataDepartmentUrl();
	string GetMasServiceTypeUrl();
	string CancelCardResidenceByCardNumberUrl();
	string GetDataResidenceCardByPersonIdUrl();
    string CheckPreRegisterIsPassUrl();
	string CheckRedemptionStatusByEmailUrl();
	string FacilitiesUrl();
	string ReservationFacilitiesCreateUrl();
	string ReservationFacilitiesUpdateUrl();
	string ReservationSearchFacilitiesQueryUrl();
	string GetReservationFacilitiesByIDUrl();
	Task<List<MinioImageResponse>> GetImageMinioUrl();
	string CheckQueueLiftUrl();
}
