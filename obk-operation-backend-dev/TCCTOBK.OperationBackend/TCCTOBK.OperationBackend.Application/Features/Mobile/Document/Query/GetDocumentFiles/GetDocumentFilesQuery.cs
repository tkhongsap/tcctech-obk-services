using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetDocumentFilesQuery : IQuery<List<DocumentCertisResult>>
{
	public string ObjectType { get; set; } = default!;
	public string? ObjectKey { get; set; }

	public GetDocumentFilesQuery(string objectType)
	{
		ObjectType = objectType;
	}

	public GetDocumentFilesQuery(string objectType, string objectKey)
	{
		ObjectType = objectType;
		ObjectKey = objectKey;
	}
}
