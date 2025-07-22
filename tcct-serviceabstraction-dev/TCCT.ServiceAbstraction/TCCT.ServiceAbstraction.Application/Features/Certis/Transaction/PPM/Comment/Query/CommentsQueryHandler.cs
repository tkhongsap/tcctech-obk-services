using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Query;
public class CommentsQueryHandler : IQueryHandler<CommentsQuery, List<CommentsResult>>
{
	private readonly ICertisService _certisservice;
	public CommentsQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CommentsResult>> Handle(CommentsQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.Comments(request.WoId);
		return res;
	}
}
