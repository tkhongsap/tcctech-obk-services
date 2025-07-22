using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class CWOTransactionsQuery : IQuery<List<CWOTransactionsResult>>
{
	public int CWOId { get; set; }

	public CWOTransactionsQuery(int cwoId)
	{
		CWOId = cwoId;
	}
}
