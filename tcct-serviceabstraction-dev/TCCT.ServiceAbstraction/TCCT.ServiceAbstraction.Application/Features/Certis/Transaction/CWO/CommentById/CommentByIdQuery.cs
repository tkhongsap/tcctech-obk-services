using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CommentById;
public class CommentByIdQuery : IQuery<List<CommentByIdResult>>
{
	public string Id { get; set; }

	public CommentByIdQuery(string id)
	{
		Id = id;
	}
}
