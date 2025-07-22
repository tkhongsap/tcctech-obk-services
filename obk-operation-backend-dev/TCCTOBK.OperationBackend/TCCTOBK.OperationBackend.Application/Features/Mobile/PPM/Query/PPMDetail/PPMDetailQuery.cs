using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class PPMDetailQuery : IQuery<PPMDetailResult>
{
	public int Id { get; set; }
	public PPMDetailQuery(int id)
	{
		this.Id = id;
	}
}
