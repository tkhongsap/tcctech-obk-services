using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.UserProfileById;
public class UserProfileByIdQuery : IQuery<List<UserProfileByIdResult>>
{
	public string UserId { get; set; }
	public UserProfileByIdQuery(string userid)
	{
		UserId = userid;
	}
}


