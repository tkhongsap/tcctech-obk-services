using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Command;
public class CommentCommandHandler : ICommandHandler<CommentCommand, CommentResult>
{
	private readonly ICertisService _certisservice;
	public CommentCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CommentResult> Handle(CommentCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.Comment(request.CwoId, request.CommentTypeId, request.Comment, request.CommentedOn, request.CommentedBy);
		return res;
	}
}
