
namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryFile;
//Digital Library
public class GetDigitalFileResult : ResultApi
{
	public string sHeaderNav { get; set; } = string.Empty;
	public string sTitle { get; set; } = string.Empty;
	public string sIntroduce { get; set; } = string.Empty;
	public List<FileDownloadItem> lstFile { get; set; } = new();
}
public class FileDownloadItem
{
	public Guid sID { get; set; }
	public string? sPathCover { get; set; }
	public string sPathFile { get; set; } = string.Empty;
	public string sFileName { get; set; } = string.Empty;
	public string sType { get; set; } = string.Empty;
	public string sSize { get; set; } = string.Empty;
}

//Result
public class ResultApi
{
	public int nStatusCode { get; set; } = 200;

	public string? sMessage { get; set; }
}
