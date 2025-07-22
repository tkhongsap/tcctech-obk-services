using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.DocumentsRelatedById;
public class DocumentsRelatedByIdQuery : IQuery<List<PPMDocumentsRelatedByIdResult>>
{
	public string Id { get; set; }

	public DocumentsRelatedByIdQuery(string id)
	{
		Id = id;
	}
}
