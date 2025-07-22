using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Command.UploadHomeContent;
internal class UploadHomeContentHandler : ICommandHandler<UploadHomeContentCommand, UploadHomeContentResult>
{
	private readonly IAPIService _apiService;

	public UploadHomeContentHandler(IAPIService apiService)
	{
		_apiService = apiService;
	}

	public async Task<UploadHomeContentResult> Handle(UploadHomeContentCommand request, CancellationToken cancellationToken)
	{
		var result = await _apiService.HomeContent.Upload(request);
		return new UploadHomeContentResult
		{
			OriginalFileName = request.FileName,
			FileName = result.FileName,
			ImageURL = result.ImageURL,
			Message = result.Message,
		};
	}
}
