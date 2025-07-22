using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Member.GetDataMember;
public class GetDataMemberQuery : IQuery<GetDataMemberResult>
{
	public int Page { get; set; }
	public int PerPage { get; set; }
	public string? Search { get; set; }
	public string? StartDate { get; set; }
	public string? EndDate { get; set; }
	public bool Active { get; set; }

	public GetDataMemberQuery(int page, int perpage, string? search, string? startDate, string? endDate, bool active)
	{
		Page = page;
		PerPage = perpage;
		Search = search;
		StartDate = startDate;
		EndDate = endDate;
		Active = active;
	}
}
