using System.Globalization;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffSearch;

public sealed class GetStaffSearchQueryHandler : IQueryHandler<GetStaffSearchQuery, List<GetStaffSearchResult>>
{
	private readonly ICertisService _certisservice;
	public GetStaffSearchQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<GetStaffSearchResult>> Handle(GetStaffSearchQuery request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CoreService.GetStaffSearch(request);
	}
}



