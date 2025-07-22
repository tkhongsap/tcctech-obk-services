using System;
using Refit;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;

public class RefreshTokenResponseModel
{
	public string access_token { get; set; } = default!;
	public string refresh_token { get; set; } = default!;
	public int expires_in { get; set; }
}

