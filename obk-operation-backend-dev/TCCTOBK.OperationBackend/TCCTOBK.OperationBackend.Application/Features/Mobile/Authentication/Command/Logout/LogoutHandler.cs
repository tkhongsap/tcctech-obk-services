using MediatR;
using System.IdentityModel.Tokens.Jwt;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Command.Logout;

public class LogoutHandler : IRequestHandler<LogoutCommand, LogoutResult>
{
	private readonly IUnitOfWork _uow;
	private readonly IAbstractionService _abstractionService;

	public LogoutHandler(IAbstractionService abstractionService, IUnitOfWork uow)
	{
		_abstractionService = abstractionService;
		_uow = uow;
	}

	public async Task<LogoutResult> Handle(LogoutCommand request, CancellationToken cancellationToken)
	{
		var handler = new JwtSecurityTokenHandler();
		var jwtSecurityToken = handler.ReadJwtToken(request.AccessToken);
		var claims = jwtSecurityToken.Claims.ToList();
		var kcUsername = claims.First(x => x.Type == "preferred_username");

		var member = await _uow.MemberRepository.GetByKeyCloakUserId(kcUsername.Value);
		if (member == null)
		{
			throw new NotFoundException("User not found");
		}
		if (!await _uow.MemberRepository.CheckTenant(member.MID, Constant.TENANT_OPERATION_APP_ID))
		{
			throw new NotFoundException("User not found");
		}
		await _uow.MemberRepository.Logout(member.MID);
		await _uow.SaveChangeAsyncWithCommit();
		return new LogoutResult() {};
	}
}
