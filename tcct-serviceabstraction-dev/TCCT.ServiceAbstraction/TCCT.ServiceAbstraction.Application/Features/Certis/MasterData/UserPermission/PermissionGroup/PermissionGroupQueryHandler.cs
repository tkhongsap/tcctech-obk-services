using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroup;
public class PermissionGroupQueryHandler : IQueryHandler<PermissionGroupQuery, List<PermissionGroupResult>>
{

	public Task<List<PermissionGroupResult>> Handle(PermissionGroupQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
