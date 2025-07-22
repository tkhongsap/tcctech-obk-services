using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipt;
public class GetReceiptQuery : IQuery<GetReceiptResult>
{
	public string uuid { get; set; }
	public required string token { get; set; }
}
