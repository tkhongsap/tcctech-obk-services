using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.EV;
namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetAccount;
public class GetAccountHandler : IQueryHandler<GetAccountQuery, GetAccountResult>
{
	private readonly IEVService _evService;
	public GetAccountHandler(IEVService evService)
	{
		_evService = evService;
	}
	public async Task<GetAccountResult> Handle(GetAccountQuery request, CancellationToken cancellationToken)
	{
		return await _evService.GetAccount(request);
	}
}
