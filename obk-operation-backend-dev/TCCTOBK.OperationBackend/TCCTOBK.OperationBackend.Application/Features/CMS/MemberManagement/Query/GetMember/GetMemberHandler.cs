using System.Data;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;

public class GetMemberHandler : IQueryHandler<GetMemberQuery, GetMemberResult>
{
	IUnitOfWork _uow;
	public GetMemberHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetMemberResult> Handle(GetMemberQuery request, CancellationToken cancellationToken)
	{
		var gmid = new Guid(request.MID);
		var member = await _uow.MemberRepository.GetById(gmid);
		var role = await _uow.RoleRepository.GetByMember(member.MID);
		var roleprivilege = role.Select(x => new RolePrivilege()
		{
			RID = x.RID,
			RoleName = x.Name,
			PrivilegeItems = x.trRolePrivilagesItem.Select(a => new PrivilegeItemData()
			{
				PTID = a.PTID,
				Name = a.mtPrivilegeItem.Name,
			}).ToList()
		}).ToList();
		var res = new GetMemberResult()
		{
			MID = member.MID,
			Email = member.Email,
			Roles = roleprivilege,
			Name = member.Name,
			CreatedDate = member.CreatedDate,
			UpdatedDate = member.UpdatedDate,
			UpdatedByName = member.UpdatedByName,
			Status = member.Status,
			KeyCloakUserId = member.KeyCloakUserId,
			IsLocked = member.IsLocked,
			StaffId = member.StaffId,
		};
		return res;
	}
}
