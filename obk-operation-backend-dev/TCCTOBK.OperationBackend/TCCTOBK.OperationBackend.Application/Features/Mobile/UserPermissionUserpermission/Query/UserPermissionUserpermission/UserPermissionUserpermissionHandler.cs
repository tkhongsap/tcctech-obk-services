using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionUserpermissionHandler : IQueryHandler<UserPermissionUserpermissionQuery, UserPermissionUserpermissionResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionUserpermissionHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionUserpermissionResult> Handle(UserPermissionUserpermissionQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionUserpermissionResult{};
		return res;

  }

}

