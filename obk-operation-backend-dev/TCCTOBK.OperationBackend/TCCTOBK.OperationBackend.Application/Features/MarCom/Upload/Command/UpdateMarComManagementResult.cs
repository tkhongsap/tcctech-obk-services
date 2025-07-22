using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Upload.Command.Upload;

public class UploadFileResult
{
	public string Message { get; set; } = string.Empty;
	public int StatusCode { get; set; }
	public UploadModel Data {get; set;} = new UploadModel();
}

public class UploadModel
{
	public string fileName { get; set; } = string.Empty;
	public string originalFileName { get; set; } = string.Empty;

}
