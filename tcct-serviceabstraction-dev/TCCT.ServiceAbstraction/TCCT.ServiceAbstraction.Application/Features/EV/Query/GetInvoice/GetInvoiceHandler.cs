using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoice;
public class GetInvoiceHandler : IQueryHandler<GetInvoiceQuery, GetInvoiceResult>
{
	private readonly IEVService _evService;
	public GetInvoiceHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetInvoiceResult> Handle(GetInvoiceQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetInvoice(request);
	}
}
