
namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetDigitalLibraryCategory;
//Digital Library
public class GetDigitalCategoryResult : ResultApi
{
	public string sTitle { get; set; } = string.Empty;
	public string sSubTitle { get; set; } = string.Empty;
	public string sIntroduce { get; set; } = string.Empty;
	public List<DigitalCategoryItem> lstCategory { get; set; } = new();
	public string sPathBackground { get; set; } = string.Empty;
}

public class DigitalCategoryItem
{
	public Guid sID { get; set; }
	public string sLabel { get; set; } = string.Empty;
}

//Result
public class ResultApi
{
	public int nStatusCode { get; set; } = 200;

	public string? sMessage { get; set; }
}
