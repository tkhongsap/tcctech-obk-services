namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.TrueMoneyOnlineCharge;

public class TrueMoneyOnlineChargeResult
{
	public string respCode { get; set; } = null!;
	public string respDesc { get; set; } = null!;
	public string qrImage { get; set; } = null!;
	public string transactionNo { get; set; } = null!;
	public int qrTimeOut { get; set; }
	public string redirect_url { get; set; } = null!;
	public string? paymentToken { get; set; }
}
