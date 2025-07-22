using System.Globalization;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;

public sealed class GetStaffRoleMappingQueryHandler : IQueryHandler<GetStaffRoleMappingQuery, List<GetStaffRoleMappingResult>>
{
	private readonly ICertisService _certisservice;
	public GetStaffRoleMappingQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<GetStaffRoleMappingResult>> Handle(GetStaffRoleMappingQuery request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.GetStaffRoleMapping(request);
	}
}



