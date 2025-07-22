using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.GetFunctionRoles;

public class GetFunctionRolesHandler : IQueryHandler<GetFunctionRolesQuery, List<GetFunctionRolesResult>>
{
   private readonly IAbstractionService _apiService;

	public GetFunctionRolesHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}

	public async Task<List<GetFunctionRolesResult>> Handle(GetFunctionRolesQuery request, CancellationToken cancellationToken)
	{
		return await _apiService.CertisTransaction.GetFunctionRoles();
	}
}
