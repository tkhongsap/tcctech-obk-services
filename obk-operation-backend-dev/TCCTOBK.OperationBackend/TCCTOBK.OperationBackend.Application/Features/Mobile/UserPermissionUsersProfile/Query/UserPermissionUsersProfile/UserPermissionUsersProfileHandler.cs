using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionUsersProfileHandler : IQueryHandler<UserPermissionUsersProfileQuery, UserPermissionUsersProfileResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionUsersProfileHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionUsersProfileResult> Handle(UserPermissionUsersProfileQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionUsersProfileResult{};
		return res;

  }

}

