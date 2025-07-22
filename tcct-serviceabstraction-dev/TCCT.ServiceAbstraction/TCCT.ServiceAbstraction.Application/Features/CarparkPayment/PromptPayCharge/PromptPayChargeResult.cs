namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.PromptPayCharge;

public class PromptPayChargeResult
{
	public string respCode { get; set; } = null!;
	public string respDesc { get; set; } = null!;
	public string qrImage { get; set; } = null!;
	public string transactionNo { get; set; } = null!;
	public int qrTimeOut { get; set; }
	public string qrId { get; set; } = null!;
	public DateTime? qrExpiredDate { get; set; }

}
