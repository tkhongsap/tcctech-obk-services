using MediatR;
using Org.BouncyCastle.Asn1.Ocsp;
using Refit;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application;

class FailEx
{
	public string? errorCode { get; set; }
}

public class LoginHandler : IRequestHandler<LoginCommand, LoginResult>
{
	private readonly IUnitOfWork _uow;
	private readonly IAbstractionService _abstractionService;

	public LoginHandler(IAbstractionService abstractionService, IUnitOfWork uow)
	{
		_abstractionService = abstractionService;
		_uow = uow;
	}

	public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
	{
		var loginRes = await LoginKeyCloak(request.Username, request.Password);
		if (loginRes == null) return new LoginResult() { AccessToken = "", RefreshToken = "", KCUsername = "", IsLocked = true };
		var handler = new JwtSecurityTokenHandler();
		var jwtSecurityToken = handler.ReadJwtToken(loginRes.access_token);
		var claims = jwtSecurityToken.Claims.ToList();
		var kcUsername = claims.First(x => x.Type == "preferred_username");
		var isLock = false;
		string? keyCloakUserId = null;

		var member = await _uow.MemberRepository.GetByKeyCloakUserId(kcUsername.Value, false);
		if (member != null && !member.IsActive) throw new NotFoundException("This user account is inactive. Please contact L1 support for assistance.", OpAppConstant.USER_NOT_FOUND);
		if (!await _uow.MemberRepository.CheckTenant(member.MID, Constant.TENANT_OPERATION_APP_ID)) throw new NotFoundException("User not found", OpAppConstant.USER_NOT_FOUND);
		await _uow.MemberRepository.ResetFailAttempt(member.MID);
		await _uow.SaveChangeAsyncWithCommit();
		isLock = member.IsLocked;
		keyCloakUserId = member.KeyCloakUserId;

		return new LoginResult()
		{
			AccessToken = loginRes.access_token,
			RefreshToken = loginRes.refresh_token,
			KCUsername = keyCloakUserId!,
			ExpiresIn = loginRes.expires_in,
			IsLocked = isLock
		};
	}

	private async Task<LoginResponseModel?> LoginKeyCloak(string username, string password)
	{
		try
		{

			var loginData = new LoginRequestModel(username, password);
			var res = await _abstractionService.UserService.Login(loginData);
			return res;
		}
		catch (ApiException ex)
		{
			var content = JsonSerializer.Deserialize<FailEx>(ex.Content);
			if (!string.IsNullOrEmpty(content.errorCode))
			{
				if (content.errorCode.ToLower() == "kcs001")
				{
					var member = await _uow.MemberRepository.GetByEmail(username);
					// close this feature 18/12/2024 confirm by p'guly because error hard to reproduce in pord
					// var member = await _uow.MemberRepository.UpdateFailAttempt(username);
					// await _uow.SaveChangeAsyncWithCommit();
					// if (member != null && member.IsLocked)
					// {
					// 	return null;
					// }
					if (member == null)
					{
						throw new BadRequestException("ไม่พบแอคเค้าท์ของท่านในระบบ กรุณาติดต่อผู้ดูแลระบบ mail L1 obk-l1@tcc-techonology.com", OpAppConstant.UNKNOW_ERROR);
					}
					else
					{
						throw new BadRequestException("Invalid username or password.", OpAppConstant.USERNAME_PASSWORD_INVALID);
					}
				}
			}
			throw new BadRequestException("Something went wrong please try again or contact admin ", OpAppConstant.UNKNOW_ERROR);
		}
	}

}
