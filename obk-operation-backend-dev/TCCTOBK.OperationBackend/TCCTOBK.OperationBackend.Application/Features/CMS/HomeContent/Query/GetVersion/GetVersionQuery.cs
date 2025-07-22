using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetVersionQuery : IQuery<GetVersionResult>
{
	public Guid HCID { get; set; }
	public GetVersionQuery(Guid hcid)
	{
		HCID = hcid;
	}
}
