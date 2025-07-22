using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CommentById;
public class CommentByIdQueryHandler : IQueryHandler<CommentByIdQuery, List<CommentByIdResult>>
{
	private readonly ICertisService _certisservice;
	public CommentByIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CommentByIdResult>> Handle(CommentByIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.CommentById(request.Id);
		return res;
	}
}
