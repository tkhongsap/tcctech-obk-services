using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.RefreshToken;

public class RefreshTokenCommand : ICommand<RefreshTokenResult>
{
	public string RefreshToken { get; set; } = default!;

	public RefreshTokenCommand(string refreshToken)
	{
		RefreshToken = refreshToken;
	}
}
