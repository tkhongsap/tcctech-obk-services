using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Transaction.GetDataTransactionTurnstile;
public class GetDataTransactionTurnstileQuery : IQuery<GetDataTransactionTurnstileResult>
{
	public int Page { get; set; }
	public int PerPage { get; set; }
	public string? Search { get; set; }
	public string? StartDate { get; set; }
	public string? EndDate { get; set; }

	public GetDataTransactionTurnstileQuery(int page, int perpage, string? search, string? startdate, string? enddate)
	{
		Page = page;
		PerPage = perpage;
		Search = search;
		StartDate = startdate;
		EndDate = enddate;
	}
}
