using TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Command.UploadHomeContent;

public class UploadHomeContentResult : HomeContentUploadResponse
{
	public string OriginalFileName { get; set; } = default!;
}