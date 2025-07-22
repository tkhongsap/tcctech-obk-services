namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment
{
	public class ArgentoPaymentSourceResponse
	{
		public string respCode { get; set; } = null!;
		public string respDesc { get; set; } = null!;
		public string sourceId { get; set; } = null!;
		public string webPaymentUrl { get; set; } = null!;
	}
}
