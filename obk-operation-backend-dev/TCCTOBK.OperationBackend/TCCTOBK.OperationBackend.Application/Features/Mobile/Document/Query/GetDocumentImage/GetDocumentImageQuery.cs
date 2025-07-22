using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetDocumentImageQuery : IQuery<GetDocumentImageResult>
{
	public string Id { get; set; } = default!;

	public GetDocumentImageQuery(string id)
	{
		Id = id;
	}
}
