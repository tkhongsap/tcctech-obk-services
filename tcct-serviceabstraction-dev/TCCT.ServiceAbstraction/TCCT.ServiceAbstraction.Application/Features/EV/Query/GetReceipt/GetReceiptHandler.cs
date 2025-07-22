using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReceipt;
public class SessionHandler : IQueryHandler<GetReceiptQuery, GetReceiptResult>
{
	private readonly IEVService _evService;
	public SessionHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetReceiptResult> Handle(GetReceiptQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetReceipt(request);
	}
}
