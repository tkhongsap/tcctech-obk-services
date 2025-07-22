using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class GetDocumentImageHandler : IQueryHandler<GetDocumentImageQuery, GetDocumentImageResult>
{
	private readonly IAbstractionService _apiService;

	public GetDocumentImageHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}

	public async Task<GetDocumentImageResult> Handle(GetDocumentImageQuery request, CancellationToken cancellationToken)
	{
		var res = await _apiService.CertisTransaction.GetImage(request.Id);
		byte[] byteArray = await res.Content.ReadAsByteArrayAsync();
		var contentType = res.Content.Headers.GetValues("Content-Type").First();
		var result = new GetDocumentImageResult
		{
			ContentType = contentType,
			ByteArray = byteArray,
		};
		return result;
	}
}
