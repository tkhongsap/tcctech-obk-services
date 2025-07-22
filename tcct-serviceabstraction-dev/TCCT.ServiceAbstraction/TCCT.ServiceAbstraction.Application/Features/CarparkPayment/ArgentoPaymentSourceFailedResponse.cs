namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment
{
	public class ArgentoPaymentSourceFailedResponse
	{
		public string respCode { get; set; } = null!;
		public string respDesc { get; set; } = null!;

		override public string ToString()
		{
			return $"[{respCode}] - {respDesc}";
		}
	}
}
