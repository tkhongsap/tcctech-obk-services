using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Query;
public class CommentsQuery : IQuery<List<CommentsResult>>
{
	public string WoId { get; set; }
	public CommentsQuery(string woid)
	{
		WoId = woid;
	}
}
