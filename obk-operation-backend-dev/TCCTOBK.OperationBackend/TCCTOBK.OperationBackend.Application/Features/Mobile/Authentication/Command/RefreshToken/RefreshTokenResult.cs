using System;
using System.Text.Json.Serialization;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.RefreshToken;

public class RefreshTokenResult
{
	public string AccessToken { get; set; } = "";
	public string RefreshToken { get; set; } = "";
	public int ExpiresIn { get; set; } = 0;
}
