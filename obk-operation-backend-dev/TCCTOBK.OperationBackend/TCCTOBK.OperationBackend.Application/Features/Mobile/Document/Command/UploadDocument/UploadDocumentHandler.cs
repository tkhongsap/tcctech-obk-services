using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class UploadDocumentHandler : ICommandHandler<UploadDocumentCommand, DocumentCertisResult>
{
	private readonly IAbstractionService _apiService;

	public UploadDocumentHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}

	public async Task<DocumentCertisResult> Handle(UploadDocumentCommand request, CancellationToken cancellationToken)
	{
		var file = await request.Image.GetBytesAsync();
		var contentType = request.Image.ContentType;
		contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
		var result = await _apiService.CertisTransaction.UploadDocument(
							request.ObjectKey,
							request.ObjectType,
							request.Description,
							request.SearchTags,
							request.AttachmentType,
							request.IsDefault,
							request.IsHidden,
							new ByteArrayPart(file, Guid.NewGuid().ToString(), contentType)
						);
		return result;
	}
}
