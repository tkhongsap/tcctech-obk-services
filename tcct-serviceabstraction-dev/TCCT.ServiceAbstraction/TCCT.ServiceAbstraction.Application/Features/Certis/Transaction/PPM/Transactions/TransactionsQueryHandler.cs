using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Transactions;
public class TransactionsQueryHandler : IQueryHandler<TransactionsQuery, List<TransactionsResult>>
{
	private readonly ICertisService _certisservice;
	public TransactionsQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<TransactionsResult>> Handle(TransactionsQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.Transactions(request.WoId);
		return res;
	}
}
