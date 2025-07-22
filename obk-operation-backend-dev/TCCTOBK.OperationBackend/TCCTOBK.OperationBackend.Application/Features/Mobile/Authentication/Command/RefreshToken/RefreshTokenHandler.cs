using System;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.RefreshToken;

public class RefreshTokenHandler : ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
{
	private readonly IAbstractionService _abstractionService;

	public RefreshTokenHandler(IAbstractionService abstractionService)
	{
		_abstractionService = abstractionService;
	}

	public async Task<RefreshTokenResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
	{
		var req = new RefreshTokenRequestModel(request.RefreshToken);
		var res = await _abstractionService.Operation.RefreshToken(req);
		return new RefreshTokenResult
		{
			AccessToken = res.access_token,
			RefreshToken = res.refresh_token,
			ExpiresIn = res.expires_in,
		};
	}
}
