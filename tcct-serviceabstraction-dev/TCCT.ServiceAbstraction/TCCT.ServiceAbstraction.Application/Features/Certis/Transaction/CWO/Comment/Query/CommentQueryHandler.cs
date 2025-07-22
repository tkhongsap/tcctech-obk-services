using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Query;
public class CommentQueryHandler : IQueryHandler<CommentQuery, List<CommentResult>>
{
	private readonly ICertisService _certisservice;
	public CommentQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CommentResult>> Handle(CommentQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.GetComments(request.CwoId);
		return res;
	}
}
