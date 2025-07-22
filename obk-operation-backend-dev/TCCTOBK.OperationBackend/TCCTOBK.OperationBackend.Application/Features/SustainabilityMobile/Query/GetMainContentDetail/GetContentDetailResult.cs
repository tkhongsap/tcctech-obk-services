
namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContentDetail;
//Content Detail
public class GetContentDetail
{
	public string sLanguage { get; set; } = "en";
	public Guid sID { get; set; }
	public bool? isBanner { get; set; } = false;
}
public class GetContentDetailResult : ResultApi
{
	public string sHeaderNav { get; set; } = string.Empty;
	public string sHeaderImagePath { get; set; } = string.Empty;
	public string sTitle { get; set; } = string.Empty;
	public string? sIntroduce { get; set; }
	public List<ContentDetailItem> lstContent { get; set; } = new();
	public string? sTitleRelated { get; set; }
	public List<RelateContentItem>? lstRelated { get; set; } = new();
}
public class ContentDetailItem
{
	public string sMode { get; set; } = string.Empty;
	public string? sContent { get; set; }
	public string? sImagePath { get; set; }
	public string? sYoutubeURL { get; set; }
	public string? sYoutubeID { get; set; }
}
public class RelateContentItem
{
	public string sImagePath { get; set; } = string.Empty;
	public string sTitle { get; set; } = string.Empty;
	public string? sDescription { get; set; }
	public Guid sLinkToID { get; set; }
	public int? nType { get; set; }
	public string? sLinkToURL { get; set; }
	public bool isBanner { get; set; } = false;
}

//Result
public class ResultApi
{
	public int nStatusCode { get; set; } = 200;

	public string? sMessage { get; set; }
}
