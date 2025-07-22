using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CommentTypes;
public class CommentTypeQueryHandler : IQueryHandler<CommentTypeQuery, List<CommentTypeResult>>
{
	private readonly ICertisService _certisservice;
	public CommentTypeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CommentTypeResult>> Handle(CommentTypeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetCommentTypes();
		return res;
	}
}
