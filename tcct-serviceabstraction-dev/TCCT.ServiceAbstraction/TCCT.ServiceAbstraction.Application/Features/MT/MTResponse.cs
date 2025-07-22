namespace TCCT.ServiceAbstraction.Application.Features.MT
{
	public class MTResponse<T> where T : class
	{
		public string? code { get; set; } = null!;
		public string? msg { get; set; }
		public T? data { get; set; }
	}
}
