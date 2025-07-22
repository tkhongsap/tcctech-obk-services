using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Other.Users;
public class UsersQueryHandler : IQueryHandler<UsersQuery, List<UsersResult>>
{
	private readonly ICertisService _certisservice;
	public UsersQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<UsersResult>> Handle(UsersQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Other.GetUsers();
		return res;
	}
}
