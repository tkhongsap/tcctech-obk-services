using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionMyprofileHandler : IQueryHandler<UserPermissionMyprofileQuery, UserPermissionMyprofileResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionMyprofileHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionMyprofileResult> Handle(UserPermissionMyprofileQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionMyprofileResult { };
		return res;

  }

}

