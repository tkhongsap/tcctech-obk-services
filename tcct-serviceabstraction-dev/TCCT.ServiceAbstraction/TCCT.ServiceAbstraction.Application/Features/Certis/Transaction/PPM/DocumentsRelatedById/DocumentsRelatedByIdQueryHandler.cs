using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.DocumentsRelatedById;
public class DocumentsRelatedByIdQueryHandler : IQueryHandler<DocumentsRelatedByIdQuery, List<PPMDocumentsRelatedByIdResult>>
{
	private readonly ICertisService _certisservice;
	public DocumentsRelatedByIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<PPMDocumentsRelatedByIdResult>> Handle(DocumentsRelatedByIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.DocumentsRelatedById(request.Id);
		return res;
	}
}
