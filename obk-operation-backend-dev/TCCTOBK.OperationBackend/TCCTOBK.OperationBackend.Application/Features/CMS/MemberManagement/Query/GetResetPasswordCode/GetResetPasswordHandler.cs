using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;

public class GetResetPasswordHandler : IQueryHandler<GetResetPasswordQuery, GetResetPasswordResult>
{
	IUnitOfWork _uow;
	public GetResetPasswordHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetResetPasswordResult> Handle(GetResetPasswordQuery request, CancellationToken cancellationToken)
	{
		var resetpassword = await _uow.ResetPasswordRepository.Get(request.ResetPasswordCode);
		if (resetpassword == null || !resetpassword.IsActive) return new GetResetPasswordResult() { isVerify = false, Message = "token is invalid or expire" };
		var member = await _uow.MemberRepository.GetById(resetpassword.MID);
		if (member == null) return new GetResetPasswordResult() { isVerify = false, Message = "not found member" };
		return new GetResetPasswordResult() { Email = member.Email, KeyCloakUserName = member.KeyCloakUserId.ToString() };
	}
}
