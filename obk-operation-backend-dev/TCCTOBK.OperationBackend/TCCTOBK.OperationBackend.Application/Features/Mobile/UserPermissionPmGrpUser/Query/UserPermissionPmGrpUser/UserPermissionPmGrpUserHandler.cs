using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionPmGrpUserHandler : IQueryHandler<UserPermissionPmGrpUserQuery, UserPermissionPmGrpUserResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionPmGrpUserHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionPmGrpUserResult> Handle(UserPermissionPmGrpUserQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionPmGrpUserResult{};
		return res;

  }

}

