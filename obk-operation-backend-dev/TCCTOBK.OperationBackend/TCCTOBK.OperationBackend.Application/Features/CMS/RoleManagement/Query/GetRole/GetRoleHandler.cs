using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRole;

internal class GetRoleHandler : IQueryHandler<GetRoleQuery, GetRoleResult>
{
	private IUnitOfWork _repo;
	public GetRoleHandler(IUnitOfWork repo)
	{
		_repo = repo;
	}
	public async Task<GetRoleResult> Handle(GetRoleQuery request, CancellationToken cancellationToken)
	{
		var pid = new Guid(request.Id);
		var role = await _repo.RoleRepository.GetById(pid);
		var result = new GetRoleResult()
		{
			// TODO: Add trRole in here
			RID = role.RID.ToString(),
			RoleId = "",
			RoleName = role.Name,
			trRolePrivilagesItem = role.trRolePrivilagesItem,
			Status = role.IsActive ? 1 : 0,
		};
		return result;
	}
}
