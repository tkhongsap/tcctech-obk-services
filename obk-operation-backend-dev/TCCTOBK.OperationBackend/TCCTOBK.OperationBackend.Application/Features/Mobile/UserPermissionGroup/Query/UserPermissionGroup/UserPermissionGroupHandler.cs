using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionGroupHandler : IQueryHandler<UserPermissionGroupQuery, UserPermissionGroupResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionGroupHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionGroupResult> Handle(UserPermissionGroupQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionGroupResult{};
		return res;

  }

}

