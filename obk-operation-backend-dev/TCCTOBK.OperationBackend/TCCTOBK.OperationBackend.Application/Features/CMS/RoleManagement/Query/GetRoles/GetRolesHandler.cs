using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Model;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRoles;

internal sealed class GetRolesHandler : IQueryHandler<GetRolesQuery, GetRolesResult>
{
	private readonly IUnitOfWork _uow;

	public GetRolesHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<GetRolesResult> Handle(GetRolesQuery request, CancellationToken cancellationToken)
	{
		var totalCount = await _uow.RoleRepository.GetAllCount(request.Filter, request.Privilges, Constant.TENANT_OBKCMS_ID);
		var roles = await _uow.RoleRepository.GetAll(request.Filter, request.Privilges, Constant.TENANT_OBKCMS_ID, request);
		var res = roles.Select(x => new RoleModel
		{
			RID = x.RID,
			Name = x.Name,
			Description = x.Description,
			PrivilegeItems = x.trRolePrivilagesItem.Where(x => x.IsActive).Select(x => x.mtPrivilegeItem).Select(p => new PrivilegeItem { PID = p.PID, PTID = p.PTID, Name = p.Name, Description = p.Description, Code = p.Code }).ToList(),
			IsActive = x.IsActive ? 1 : 0,
			UpdatedByName = x.UpdatedByName,
			UpdatedDate = x.UpdatedDate.ToString("yyyy-MM-dd HH:mm")
		}).ToList();

		return new GetRolesResult(totalCount, res);
	}
}
