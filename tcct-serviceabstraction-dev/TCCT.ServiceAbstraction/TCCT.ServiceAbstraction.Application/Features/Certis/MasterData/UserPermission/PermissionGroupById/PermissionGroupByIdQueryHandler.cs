using TCCT.ServiceAbstraction.Application.Configuration.Queries;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupById;
public class PermissionGroupByIdQueryHandler : IQueryHandler<PermissionGroupByIdQuery, List<PermissionGroupByIdResult>>
{
	public Task<List<PermissionGroupByIdResult>> Handle(PermissionGroupByIdQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
