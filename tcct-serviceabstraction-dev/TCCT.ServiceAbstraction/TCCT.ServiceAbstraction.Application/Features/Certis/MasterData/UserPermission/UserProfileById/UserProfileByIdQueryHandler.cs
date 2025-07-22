using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserProfileById;
public class UserProfileByIdQueryHandler : IQueryHandler<UserProfileByIdQuery, List<UserProfileByIdResult>>
{

	public Task<List<UserProfileByIdResult>> Handle(UserProfileByIdQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
