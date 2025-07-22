using System;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.RefreshToken;

public class RefreshTokenRequest
{
	public string RefreshToken { get; set; } = default!;

	public RefreshTokenRequest(string refreshToken)
	{
		RefreshToken = refreshToken;
	}
}
