using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Query;
public class CommentQuery : IQuery<List<CommentResult>>
{
	public string CwoId { get; set; } = null!;

	public CommentQuery(string cwoId)
	{
		CwoId = cwoId;
	}

}
