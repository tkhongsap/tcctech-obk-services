using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.DocumentsRelatedById;
public class DocumentsRelatedByIdQueryHandler : IQueryHandler<DocumentsRelatedByIdQuery, List<DocumentsRelatedByIdResult>>
{
	private readonly ICertisService _certisservice;
	public DocumentsRelatedByIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<DocumentsRelatedByIdResult>> Handle(DocumentsRelatedByIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.DocumentsRelatedById(request.Id);
		return res;
	}
}
