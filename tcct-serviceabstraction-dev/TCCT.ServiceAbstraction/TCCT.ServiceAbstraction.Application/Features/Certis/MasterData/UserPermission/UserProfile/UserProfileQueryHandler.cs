using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserProfile;
public class UserQueryHandler : IQueryHandler<UserProfileQuery, List<UserProfileResult>>
{
	public Task<List<UserProfileResult>> Handle(UserProfileQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
