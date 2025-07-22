using System;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;

public class RefreshTokenRequestModel
{
	public string RefreshToken { get; set; } = default!;

	public RefreshTokenRequestModel(string refreshToken)
	{
		RefreshToken = refreshToken;
	}
}
