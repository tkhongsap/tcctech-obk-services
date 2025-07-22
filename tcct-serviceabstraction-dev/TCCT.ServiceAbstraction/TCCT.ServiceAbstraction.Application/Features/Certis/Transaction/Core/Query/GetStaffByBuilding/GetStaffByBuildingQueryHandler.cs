using System.Globalization;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffByBuilding;

public sealed class GetStaffByBuildingQueryHandler : IQueryHandler<GetStaffByBuildingQuery, List<GetStaffByBuildingResult>>
{
	private readonly ICertisService _certisservice;
	public GetStaffByBuildingQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<GetStaffByBuildingResult>> Handle(GetStaffByBuildingQuery request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.GetStaffByBuilding(request);
	}
}



