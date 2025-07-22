using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoice;
public class GetInvoiceQuery : IQuery<GetInvoiceResult>
{
	public required string uuid { get; set; }
	public required string token { get; set; }
}
