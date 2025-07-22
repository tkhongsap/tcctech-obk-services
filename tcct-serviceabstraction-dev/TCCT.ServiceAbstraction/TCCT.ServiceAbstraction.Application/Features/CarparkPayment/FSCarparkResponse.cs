namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment
{
	public class FSCarparkResponse<T> where T : class
	{
		public string message { get; set; } = null!;
		public int status { get; set; }
		public T? data { get; set; }
	}
}
