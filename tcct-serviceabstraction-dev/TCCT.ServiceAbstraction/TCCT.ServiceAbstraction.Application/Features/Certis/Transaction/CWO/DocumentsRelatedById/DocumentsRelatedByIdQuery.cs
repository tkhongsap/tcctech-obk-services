using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.DocumentsRelatedById;
public class DocumentsRelatedByIdQuery : IQuery<List<DocumentsRelatedByIdResult>>
{
	public string Id { get; set; }

	public DocumentsRelatedByIdQuery(string id)
	{
		Id = id;
	}
}
