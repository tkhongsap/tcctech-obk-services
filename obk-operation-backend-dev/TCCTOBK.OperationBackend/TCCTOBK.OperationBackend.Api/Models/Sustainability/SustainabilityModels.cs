namespace TCCTOBK.OperationBackend.Api.Models;

public class UploadModelDoc : ResultApi
{
	public string fileName { get; set; } = string.Empty;
	public string originalFileName { get; set; } = string.Empty;
	public string? imageURL { get; set; } = string.Empty;

}
public class ResultApi
{
	public int nStatusCode { get; set; } = 200;

	public string? sMessage { get; set; }

	public object? objResult { get; set; }
}

