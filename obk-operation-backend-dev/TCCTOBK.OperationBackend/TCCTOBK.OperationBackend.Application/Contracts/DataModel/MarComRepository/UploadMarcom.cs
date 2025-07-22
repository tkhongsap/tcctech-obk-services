
namespace TCCTOBK.OperationBackend.Application;

public class UplaodDataModel
{
	public string FileContentBase64 { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string ContentType { get; set; } = default!;

	public UplaodDataModel(string fileContentBase64, string fileName, string contentType)
	{
		FileContentBase64 = fileContentBase64;
		FileName = fileName;
		ContentType = contentType;
	}
}