using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class GetDocumentFilesHandler : IQueryHandler<GetDocumentFilesQuery, List<DocumentCertisResult>>
{
	private readonly IAbstractionService _apiService;

	public GetDocumentFilesHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}

	public Task<List<DocumentCertisResult>> Handle(GetDocumentFilesQuery request, CancellationToken cancellationToken)
	{
		if (string.IsNullOrEmpty(request.ObjectKey))
		{
			return _apiService.CertisTransaction.GetDocumentFiles(request.ObjectType);
		}
		return _apiService.CertisTransaction.GetDocumentFiles(request.ObjectType, request.ObjectKey);
	}
}
