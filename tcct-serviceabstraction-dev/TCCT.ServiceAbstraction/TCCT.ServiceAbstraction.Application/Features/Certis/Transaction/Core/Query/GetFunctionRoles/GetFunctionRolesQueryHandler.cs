using System.Globalization;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetFunctionRoles;

public sealed class GetFunctionRolesQueryHandler : IQueryHandler<GetFunctionRolesQuery, List<GetFunctionRolesResult>>
{
	private readonly ICertisService _certisservice;
	public GetFunctionRolesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<GetFunctionRolesResult>> Handle(GetFunctionRolesQuery request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.GetFunctionRoles(request);
	}
}



