namespace TCCT.ServiceAbstraction.Application.Features.Keycloak
{
	public class KeycloakResponse
	{
		public string access_token { get; set; } = string.Empty;
		public int expires_in { get; set; }
		public int refresh_token_expires_in { get; set; }
		public string refresh_token { get; set; } = string.Empty;
		public string token_type { get; set; } = string.Empty;
		public string session_state { get; set; } = string.Empty;
		public string scope { get; set; } = string.Empty;
	}
}
