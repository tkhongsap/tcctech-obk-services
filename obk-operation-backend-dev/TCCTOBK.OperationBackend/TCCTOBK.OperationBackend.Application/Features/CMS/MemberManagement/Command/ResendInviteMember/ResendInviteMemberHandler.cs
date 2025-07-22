using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.ResendInviteMember;
internal class ResendInviteMemberHandler : IRequestHandler<ResendInviteMemberCommand, ResendInviteMemberResult>
{
	IUnitOfWork _uow;
	private readonly IMailService _mailService;
	public ResendInviteMemberHandler(IUnitOfWork uow, IMailService mailService)
	{
		_uow = uow;
		_mailService = mailService;

	}
	public async Task<ResendInviteMemberResult> Handle(ResendInviteMemberCommand request, CancellationToken cancellationToken)
	{
		var emailactivity = new EmailActivityModel() { RedirectURL = "", SendBy = "test", SendByName = "test", SendDate = DateTime.Now };
		_ = await _uow.MemberRepository.UpdateEmailActivityMember(request.MID, emailactivity, request);
		var user = await _uow.MemberRepository.GetById(request.MID);
		await _uow.InviteMemberRepository.UpdateStatusMID(request.MID);
		var iv = await _uow.InviteMemberRepository.Create(request.MID, request);
		var emailbody = $@"
<h1 style='text-transform: uppercase;
  font-weight: bold;'>One Bangkok</h1>
<p style='margin-bottom: 20px;'>You have been invited as a member for One Bangkok CMS</p>
<p style='margin-bottom: 20px;'>As a member for One Bangkok CMS, you will be able to manage the content inside One Bangkok app, following the privileges granted to you.</p>
<p style='margin-bottom: 20px;'>To accept the invitation, you can click the link below</p>
<a style= 'background-color: black;
	color: white;
	padding: 10px 20px;
	text-align: center;
	display: inline-block;
	font-size: 16px;
	margin: 4px 2px;
	cursor: pointer;
	border-radius: 12px;' 
    href=" + DomainConfig.CMS.EndPoint + "/register?id=" + request.MID.ToString() + "&invitecode=" + iv +@"
    type='submit'>Accept the invitation</a>
<p style='font-size: 0.8em;'>One Bangkok Ltd. - Witthayu Rd., Lumphini, Pathum Wan, Bangkok 10330</p>
";
		var bodymail = new MailRequest(new List<string>() { user.Email }, "You have been invited as a member for One Bangkok CMS", emailbody, null, null);
		await _mailService.SendEmailAsync(bodymail);
		await _uow.SaveChangeAsyncWithCommit();
		return new ResendInviteMemberResult();
	}
}
