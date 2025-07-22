using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipts;

public class GetReceiptsQuery : IQuery<GetReceiptsResult>
{
	public required string token { get; set; }
	public string? month { get; set; }
	public int? pageLimit { get; set; }
	public int? pageLast { get; set; }
}
