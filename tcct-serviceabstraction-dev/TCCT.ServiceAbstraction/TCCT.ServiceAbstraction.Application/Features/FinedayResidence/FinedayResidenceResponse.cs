namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence
{
	public class FinedayResidenceResponse<T> where T : class
	{
		public string message { get; set; } = null!;
		public int status { get; set; }
		public T? data { get; set; }
	}

	public class FinedayResidenceBookingResponse<T> where T : class
	{
		public string message { get; set; } = null!;
		public int code { get; set; }
		public T? data { get; set; }
		public int? total { get; set; }
	}
}
