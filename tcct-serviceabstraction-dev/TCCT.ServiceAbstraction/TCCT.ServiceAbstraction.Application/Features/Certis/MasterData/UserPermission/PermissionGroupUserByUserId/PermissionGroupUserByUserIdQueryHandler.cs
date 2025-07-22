using TCCT.ServiceAbstraction.Application.Configuration.Queries;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupUserByUserId;
public class PermissionGroupUserByUserIdQueryHandler : IQueryHandler<PermissionGroupUserByUserIdQuery, List<PermissionGroupUserByUserIdResult>>
{

	public Task<List<PermissionGroupUserByUserIdResult>> Handle(PermissionGroupUserByUserIdQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
