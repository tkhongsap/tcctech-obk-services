using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.FunctionRole;
public class PermissionGroupQueryHandler : IQueryHandler<FunctionRoleQuery, List<FunctionRoleResult>>
{



	public Task<List<FunctionRoleResult>> Handle(FunctionRoleQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
