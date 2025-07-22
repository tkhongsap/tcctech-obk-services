using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, ForgotPasswordResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public ForgotPasswordHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<ForgotPasswordResult> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
	{
		var member = await _uow.MemberRepository.GetByEmail(request.Email);
		if (member?.Status == Constant.MEMBERSTATUS_GRANTED)
		{
			var isclose = await _uow.ResetPasswordRepository.CloseAllMember(member.MID);
			if (!isclose) return new ForgotPasswordResult() { IsSuccess = false, Message = "can't close all old token" };
			{
				var newtoken = await _uow.ResetPasswordRepository.Create(member.MID, member);
				if (string.IsNullOrEmpty(newtoken)) return new ForgotPasswordResult() { IsSuccess = false, Message = "can't create resettoken" };
				await _uow.SaveChangeAsyncWithCommit();
				var emailbody = $@"
<h1 style='text-transform: uppercase;
  font-weight: bold;'>One Bangkok</h1>
<p style='margin-bottom: 20px;'>You have been Reset Password as a member for One Bangkok CMS</p>
<p style='margin-bottom: 20px;'>To set up new password, you can click the link below</p>
<a style= 'background-color: black;
  color: white;
  padding: 10px 20px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;' 
  href=" + DomainConfig.CMS.EndPoint + "/resetpassword?id=" + newtoken +@"
  type='submit'>Set Up New Password
</a>
<p style='font-size: 0.8em;'>One Bangkok Ltd. - Witthayu Rd., Lumphini, Pathum Wan, Bangkok 10330</p>
";
				var bodymail = new MailRequest(new List<string>() { request.Email }, "Reset your One Bangkok CMS Password", emailbody, null, null);
				await _msr.SendEmailAsync(bodymail);
				await _uow.SaveChangeAsyncWithCommit();
				return new ForgotPasswordResult();
			}
		}
		else
		{
			return new ForgotPasswordResult() { IsSuccess = false, Message = "not found member" };
		}
	}
}
