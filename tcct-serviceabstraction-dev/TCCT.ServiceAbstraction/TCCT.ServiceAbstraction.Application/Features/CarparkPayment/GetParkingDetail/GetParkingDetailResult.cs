namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GetParkingDetail;

public class GetParkingDetailResult
{
	public string? Status { get; set; }
	public string? Message { get; set; }
	public string? Exeption { get; set; }
	public string? LogId { get; set; }
	public string? TicketNo { get; set; }
	public string? TicketUid { get; set; }
	public string? PlateNo { get; set; }
	public int ExitStatus { get; set; }
	public int TerminalInId { get; set; }
	public string? TerminalInName { get; set; }
	public int MemberTypeId { get; set; }
	public string? MemberTypeName { get; set; }
	public int VehicleTypeId { get; set; }
	public string? VehicleTypeName { get; set; }
	public string? EntryDateTime { get; set; }
	public string? LogDateTime { get; set; }
	public bool IsCardLost { get; set; }
	public int ParkHH { get; set; }
	public int ParkMM { get; set; }
	public int RateHH { get; set; }
	public int FreeHH { get; set; }
	public string? RateCode { get; set; }
	public string? RateDetailTH { get; set; }
	public string? RateDetailEN { get; set; }
	public string? TenantId { get; set; }
	public string? TenantName { get; set; }
	public int SubTotal { get; set; }
	public int Discount { get; set; }
	public int ParkFee { get; set; }
	public int CardLostFine { get; set; }
	public int OverNightFine { get; set; }
	public int Total { get; set; }
	public bool IsInv { get; set; }
	public int InvRateHH { get; set; }
	public int InvFee { get; set; }
	public bool IsPayAtKiosk { get; set; }
	public string? LastDateTimePaymentAtKiosk { get; set; }
	public int PayAtKioskAll { get; set; }
	public int TimeUsedInMinute { get; set; }
	public int DurationInMinute { get; set; }
	public int RemainInMinute { get; set; }
}