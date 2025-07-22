namespace TCCT.ServiceAbstraction.Application.Features.Certis.Models.Auth;

public class AuthResult
{
	public string access_token { get; set; }
	public int? expires_in { get; set; }
	public int? refresh_expires_in { get; set; }
	public string? token_type { get; set; }
	public string? scope { get; set; }
}