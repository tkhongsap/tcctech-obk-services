namespace TCCTOBK.OperationBackend.Application.Features.CMS.HomeContent.Model;
public class HomeContentUploadRequest
{
	public string FileContentBase64 { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string ContentType { get; set; } = default!;
}
