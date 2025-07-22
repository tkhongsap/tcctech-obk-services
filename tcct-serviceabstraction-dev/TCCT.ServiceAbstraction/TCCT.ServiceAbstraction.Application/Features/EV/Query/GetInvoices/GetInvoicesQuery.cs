using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoices;

public class GetInvoicesQuery : IQuery<GetInvoicesResult>
{
	public required string token { get; set; }
	public string? month { get; set; }
	public int? pageLimit { get; set; }
	public int? pageLast { get; set; }
}
