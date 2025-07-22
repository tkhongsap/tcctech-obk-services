using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionPmGrpPmHandler : IQueryHandler<UserPermissionPmGrpPmQuery, UserPermissionPmGrpPmResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionPmGrpPmHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionPmGrpPmResult> Handle(UserPermissionPmGrpPmQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionPmGrpPmResult{};
		return res;

  }

}

