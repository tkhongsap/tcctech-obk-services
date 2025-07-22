namespace TCCT.ServiceAbstraction.Application.Features.Netatmo
{
	public class NetatmoError
	{
		public Error error { get; set; } = null!;
	}

	public class Error
	{
		public string message { get; set; } = null!;
	}
}