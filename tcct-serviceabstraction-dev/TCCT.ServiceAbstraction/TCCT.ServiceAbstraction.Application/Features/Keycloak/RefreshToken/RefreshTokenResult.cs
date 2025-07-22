using System;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.RefreshToken;

public class RefreshTokenResult
{
	public string access_token { get; set; } = null!;
	public string refresh_token { get; set; } = null!;
	public int expires_in { get; set; }
}
