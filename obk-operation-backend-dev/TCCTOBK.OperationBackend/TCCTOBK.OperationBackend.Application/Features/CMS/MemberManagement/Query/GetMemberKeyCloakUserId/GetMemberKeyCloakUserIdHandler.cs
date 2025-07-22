using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberKeyCloakUserId;
internal class GetMemberKeyCloakUserIdHandler : IQueryHandler<GetMemberKeyCloakUserIdQuery, GetMemberKeyCloakUserIdResult>
{
	private readonly IUnitOfWork _uow;

	public GetMemberKeyCloakUserIdHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<GetMemberKeyCloakUserIdResult> Handle(GetMemberKeyCloakUserIdQuery request, CancellationToken cancellationToken)
	{
		var member = await _uow.MemberRepository.GetByKeyCloakUserId(request.keyCloakUserId);
		var role = await _uow.RoleRepository.GetByMember(member.MID);
		var roleprivilege = role.Select(x => new RolePrivilege
		{
			RID = x.RID,
			RoleName = x.Name,
			PrivilegeItems = x.trRolePrivilagesItem
					.Where(a => a.mtPrivilegeItem.IsActive)
					.Select(a => new PrivilegeItemData
					{
						PTID = a.PTID,
						Name = a.mtPrivilegeItem.Name,
						Code = a.mtPrivilegeItem.Code
					})
					.ToList()
		}).ToList();
        var csid = member.ClientMember.Select(x => x.CSID).ToList();
		var res = new GetMemberKeyCloakUserIdResult()
        {
            MID = member.MID,
            Email = member.Email,
            Roles = roleprivilege,
            Name = member.Name,
            CreatedDate = member.CreatedDate,
            UpdatedDate = member.UpdatedDate,
            UpdatedByName = member.UpdatedByName,
            Status = member.Status,
            CSID = csid
		};
		return res;
	}
}
