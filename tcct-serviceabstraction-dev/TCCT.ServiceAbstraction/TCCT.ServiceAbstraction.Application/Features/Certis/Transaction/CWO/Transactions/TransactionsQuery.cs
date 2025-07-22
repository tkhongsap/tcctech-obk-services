using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Transactions;
public class TransactionsQuery : IQuery<List<TransactionsResult>>
{
	public string Id { get; set; }

	public TransactionsQuery(string id)
	{
		Id = id;
	}
}
