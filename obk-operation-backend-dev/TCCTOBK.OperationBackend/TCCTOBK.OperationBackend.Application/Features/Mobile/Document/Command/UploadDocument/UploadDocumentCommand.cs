using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application;

public class UploadDocumentCommand : ICommand<DocumentCertisResult>
{
	public int ObjectKey { get; set; }
	public string ObjectType { get; set; } = default!;
	public string Description { get; set; } = default!;
	public string SearchTags { get; set; } = default!;
	public string AttachmentType { get; set; } = default!;
	public string IsDefault { get; set; } = default!;
	public string IsHidden { get; set; } = default!;
	public IFormFile Image { get; set; } = default!;
}
