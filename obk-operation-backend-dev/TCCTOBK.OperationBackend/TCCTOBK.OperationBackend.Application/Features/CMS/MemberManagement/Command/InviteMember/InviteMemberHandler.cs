using System.Linq;
using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Helper.Service;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.InviteMember;

public class InviteMemberHandler : IRequestHandler<InviteMemberCommand, InviteMemberResult>
{
	IUnitOfWork _uow;
	private readonly IMailService _mailService;
	private readonly IClientSiteService _clientSiteService;
	public InviteMemberHandler(IUnitOfWork uow, IMailService mailService, IClientSiteService clientSiteService)
	{
		_uow = uow;
		_mailService = mailService;
		_clientSiteService = clientSiteService;
	}
	public async Task<InviteMemberResult> Handle(InviteMemberCommand request, CancellationToken cancellationToken)
	{
		var checkmember = await _uow.MemberRepository.GetByEmail(request.Email);
		if (checkmember != null 
		&& checkmember.tenantMembers.Any(x => x.TID == Constant.TENANT_OBKCMS_ID && x.CSID == _clientSiteService.ClientSiteId)) throw new BadRequestException("Email นี้มีอยู่ในระบบแล้ว");

		if (checkmember == null) {
			var mid = await _uow.MemberRepository.CreateMember(request.Email, Constant.MEMBERSTATUS_PENDING, request.Roles, request);
			var invitecode = Guid.NewGuid().ToString();
			var iv = await _uow.InviteMemberRepository.Create(mid, request);
			await _uow.MemberRepository.InsertTenantMember(mid, Constant.TENANT_OBKCMS_ID, _clientSiteService.ClientSiteId);
			var emailbody = EmailBody(mid, iv);
			var bodymail = new MailRequest(new List<string>() { request.Email }, "You have been invited as a member for One Bangkok CMS", emailbody, null, null);
			await _mailService.SendEmailAsync(bodymail);
		} else {
			var clientSiteId = Constant.OBK_CLIENT_SITE;
			if (checkmember.tenantMembers.Any(x => x.TID == Constant.TENANT_OBKCMS_ID && x.CSID == Constant.OBK_CLIENT_SITE))
			{
				clientSiteId = Constant.PARQ_CLIENT_SITE;
			}

			await _uow.MemberRepository.InsertTenantMember(checkmember.MID, Constant.TENANT_OBKCMS_ID, _clientSiteService.ClientSiteId, request.UpdatedBy, request.UpdatedByName);
			await _uow.RoleRepository.UpdateRoleMember(checkmember.MID, request.Roles, Constant.TENANT_OBKCMS_ID);
			var hasClientMember = await _uow.MemberRepository.CheckClientMember(checkmember.MID, _clientSiteService.ClientSiteId);
			if (!hasClientMember)
			{
				await _uow.MemberRepository.AddClientMember(checkmember.MID);
			}
		}
		await _uow.SaveChangeAsyncWithCommit();
		return new InviteMemberResult() { Message = "Success" };
	}

	private string EmailBody(Guid memberid, string invitecode)
	{
		return $@"
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
    href=" + DomainConfig.CMS.EndPoint + "/register?id=" + memberid.ToString() + "&invitecode=" + invitecode +@"
    type='submit'>Accept the invitation</a>
<p style='font-size: 0.8em;'>One Bangkok Ltd. - Witthayu Rd., Lumphini, Pathum Wan, Bangkok 10330</p>
";
	}

}