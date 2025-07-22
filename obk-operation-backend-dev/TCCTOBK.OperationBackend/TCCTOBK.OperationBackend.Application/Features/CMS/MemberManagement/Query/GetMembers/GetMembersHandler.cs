using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMember;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMembers;

public class GetMembersHandler : IQueryHandler<GetMembersQuery, GetMembersResult>
{
	IUnitOfWork _uow;
	public GetMembersHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetMembersResult> Handle(GetMembersQuery request, CancellationToken cancellationToken)
	{
		var member = await _uow.MemberRepository.GetAll(request.Filter, request.Roles, request.Status, request.TenantIds, request.IsAvailable, request);
		var totalCount = await _uow.MemberRepository.GetAllCount(request.Filter, request.Roles, request.Status, request.TenantIds, request.IsAvailable, request);

		var res = new List<GetMemberResult>();
		foreach (var item in member)
		{
			var roleprivilege = item.trRoleMembers.Select(x => new RolePrivilege()
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
				Name = item.Name
			};
			res.Add(rs);
		}

		if (request.TenantIds != null && request.TenantIds.Contains(Constant.TENANT_OPERATION_APP_ID))
		{
			var socMember = await _uow.MemberRepository.GetAll(request.Filter, request.Roles, request.Status, request.TenantIds, request.IsAvailable, request);
			// var soctotalCount = await _uow.SOCUserRepository.GetAllCount(request.Filter, request.Roles, request.Status, request.TenantIds, request.IsAvailable, request);
			totalCount = totalCount + socMember.Count();

			foreach (var item in socMember)
			{
				var roleprivilege = item.trRoleMembers.Select(x => new RolePrivilege()
				{
					RID = x.RID,
					RoleName = x.trRole.Name,
					PrivilegeItems = x.trRole.trRolePrivilagesItem.Select(a => new PrivilegeItemData()
					{
						PTID = a.PTID,
						Name = a.mtPrivilegeItem.Name,
					}).ToList()
				}).ToList();
				var dtjson = JsonSerializer.Deserialize<MemberDataJsonModel>(item.DataJson);
				var rs = new GetMemberResult()
				{
					MID = item.MID,

					Email = dtjson.Email,
					Roles = roleprivilege,
					// เอา ?? ออกตอน ได้ iden มาใช้แล้ว
					UpdatedDate = item.UpdatedDate,
					UpdatedByName = item.UpdatedByName,
					Status = item.Status,
					CreatedDate = item.CreatedDate,
					Name = item.FirstName + " " + item.LastName
				};
				res.Add(rs);
			}

		}

		res = res.OrderByDescending(x => x.UpdatedDate).ToList();

		return new GetMembersResult(totalCount, res);
	}
}
