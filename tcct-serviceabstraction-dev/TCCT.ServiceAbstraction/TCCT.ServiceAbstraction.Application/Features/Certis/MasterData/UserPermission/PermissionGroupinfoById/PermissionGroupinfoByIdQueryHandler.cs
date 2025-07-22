using MediatR;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupinfoById;
public class PermissionGroupinfoByIdQueryHandler : IQueryHandler<PermissionGroupinfoByIdQuery, List<PermissionGroupinfoByIdResult>>
{
	Task<List<PermissionGroupinfoByIdResult>> IRequestHandler<PermissionGroupinfoByIdQuery, List<PermissionGroupinfoByIdResult>>.Handle(PermissionGroupinfoByIdQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
