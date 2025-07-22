using System.CodeDom;
using System.Net.WebSockets;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembersOpsApp;

public class GetMembersOpsAppHandler : IQueryHandler<GetMembersOpsAppQuery, GetMembersOpsAppResult>
{
	IUnitOfWork _uow;
	public GetMembersOpsAppHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetMembersOpsAppResult> Handle(GetMembersOpsAppQuery request, CancellationToken cancellationToken)
	{
		request.TenantIds = new List<Guid> { Constant.TENANT_OPERATION_APP_ID };
		var member = await _uow.MemberRepository.GetAll(request.Filter, request.Roles, request.Status, request.TenantIds, request.IsAvailable, request);
		var totalCount = await _uow.MemberRepository.GetAllCount(request.Filter, request.Roles, request.Status, request.TenantIds, request.IsAvailable, request);
		var res = new List<GetMemberResult>();
		foreach (var item in member)
		{
			var roleprivilege = item.trRoleMembers.Where(x => x.trRole.TID == Constant.TENANT_OPERATION_APP_ID).Select(x => new RolePrivilege()
			{
				RID = x.RID,
				RoleName = x.trRole.Name,
				PrivilegeItems = x.trRole.trRolePrivilagesItem.Select(a => new PrivilegeItemData()
				{
					PTID = a.PTID,
					Name = a.mtPrivilegeItem.Name,
				}).ToList()
			}).ToList();

			var rs = new GetMemberResult()
			{
				MID = item.MID,
				Email = item.Email,
				Roles = roleprivilege,
				// เอา ?? ออกตอน ได้ iden มาใช้แล้ว
				UpdatedDate = item.UpdatedDate,
				UpdatedByName = item.UpdatedByName,
				Status = item.Status,
				CreatedDate = item.CreatedDate,
				Name = item.Name,
				IsLocked = item.IsLocked,
				IsActive = item.IsActive,
			};
			res.Add(rs);
		}

		res = res.OrderByDescending(x => x.UpdatedDate).ToList();

		return new GetMembersOpsAppResult(totalCount, res);
	}
}
