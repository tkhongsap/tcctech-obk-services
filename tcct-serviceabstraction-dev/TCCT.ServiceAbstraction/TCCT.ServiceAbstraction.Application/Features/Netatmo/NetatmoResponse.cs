namespace TCCT.ServiceAbstraction.Application.Features.Netatmo
{
	public class NetatmoResponse
	{
		public string access_token { get; set; } = string.Empty;
		public string refresh_token { get; set; } = string.Empty;
		public int expires_in { get; set; }
		public int expire_in { get; set; }
		public List<string> scope { get; set; } = new List<string>();
	}
}