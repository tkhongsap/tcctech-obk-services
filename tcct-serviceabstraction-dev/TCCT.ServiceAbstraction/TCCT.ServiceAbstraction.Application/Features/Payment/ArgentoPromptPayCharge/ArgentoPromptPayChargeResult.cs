namespace TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;

public class ArgentoPromptPayChargeResult
{
	public string respCode { get; set; } = null!;
	public string respDesc { get; set; } = null!;
	public string qrImage { get; set; } = null!;
	public string transactionNo { get; set; } = null!;
	public int qrTimeOut { get; set; }
	public string qrId { get; set; } = null!;
	public DateTime? qrExpiredDate { get; set; }

}
