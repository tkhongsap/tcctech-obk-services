using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCase;
public class GetCaseQuery : IQuery<GetCaseResult>
{
	public int CID { get; set; }
	public bool Scope { get; set; }
	public GetCaseQuery(int cid, bool scope)
	{
		CID = cid;
		Scope = scope;
	}
}