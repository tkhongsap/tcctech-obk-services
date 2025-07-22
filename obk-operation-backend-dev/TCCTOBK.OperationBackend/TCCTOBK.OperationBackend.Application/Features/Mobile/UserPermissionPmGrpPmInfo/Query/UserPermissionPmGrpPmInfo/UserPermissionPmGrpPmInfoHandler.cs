using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionPmGrpPmInfoHandler : IQueryHandler<UserPermissionPmGrpPmInfoQuery, UserPermissionPmGrpPmInfoResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionPmGrpPmInfoHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionPmGrpPmInfoResult> Handle(UserPermissionPmGrpPmInfoQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionPmGrpPmInfoResult{};
		return res;

  }

}

