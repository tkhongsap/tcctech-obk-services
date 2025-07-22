using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.CWOStatusCode;
public class CWOStatusCodeQuery : IQuery<CWOStatusCodeResult>
{
	public int Id { get; set; }
	public CWOStatusCodeQuery(int id)
	{
		Id = id;
	}
}
