using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffSearch;
public class GetStaffSearchQuery : IQuery<List<GetStaffSearchResult>>
{
    public string? Search { get; set; }

	public GetStaffSearchQuery(string? search)
	{
		Search = search;
	}
}
