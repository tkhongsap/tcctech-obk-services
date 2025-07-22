using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetInvoices;
public class GetInvoicesHandler : IQueryHandler<GetInvoicesQuery, GetInvoicesResult>
{
	private readonly IEVService _evService;
	public GetInvoicesHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetInvoicesResult> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetInvoices(request);
	}
}
