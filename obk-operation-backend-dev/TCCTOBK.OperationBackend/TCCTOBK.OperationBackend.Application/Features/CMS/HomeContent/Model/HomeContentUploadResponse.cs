using Refit;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Model;
public class HomeContentUploadResponse
{
	public string Message { get; set; } = default!;
	[AliasAs("Filename")]
	public string FileName { get; set; } = default!;
	[AliasAs("ImageUrl")]
	public string ImageURL { get; set; } = default!;
}
