using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserPermissions;
public class UserPermissionsQueryHandler : IQueryHandler<UserPermissionsQuery, List<UserPermissionsResult>>
{
	public Task<List<UserPermissionsResult>> Handle(UserPermissionsQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
