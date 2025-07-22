using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Transactions;
public class TransactionsQuery : IQuery<List<TransactionsResult>>
{
	public string WoId { get; set; }
	public TransactionsQuery(string woid)
	{
		WoId = woid;
	}
}
