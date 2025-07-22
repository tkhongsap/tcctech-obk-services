using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class UserPermissionFunctionroleHandler : IQueryHandler<UserPermissionFunctionroleQuery, UserPermissionFunctionroleResult>
{

  private readonly IAbstractionService _apiService;

  public UserPermissionFunctionroleHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<UserPermissionFunctionroleResult> Handle(UserPermissionFunctionroleQuery request, CancellationToken cancellationToken)
  {
    var res = new UserPermissionFunctionroleResult{};
		return res;

  }

}

