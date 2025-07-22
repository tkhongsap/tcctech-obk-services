using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Upload.Command.Upload;

public class UploadCommand : AuditableModel, ICommand<UploadFileResult>
{
	public string FileContentBase64 { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string ContentType { get; set; } = default!;
}

