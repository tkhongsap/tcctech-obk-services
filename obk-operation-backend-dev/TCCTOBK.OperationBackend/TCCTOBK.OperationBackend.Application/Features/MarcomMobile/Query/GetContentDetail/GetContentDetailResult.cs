
namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetContentDetail;
public class GetContentDetail
{
	public string sLanguage { get; set; } = "en";
	public Guid sID { get; set; }
	public string sMode { get; set; } = string.Empty;
	public bool? isBanner { get; set; } = false;
}

// Content Detail
public class ContentDetailResult : ResultApi
{
	public string sHeaderNav { get; set; } = string.Empty;
	public Guid sID { get; set; }
	public string sHeaderImagePath { get; set; } = string.Empty;
	public string? sTextImage { get; set; }
	public string? sTitle { get; set; }
	public string? sIntroduce { get; set; }
	public List<ContentDetailItem> lstContent { get; set; } = new();
	public string? sTitleRelated { get; set; }
	public string? sSubTitleRelated { get; set; }
	public List<RelateContentItem>? lstRelated { get; set; } = new();
	public List<TagItem>? lstTag { get; set; } = new();
	public bool isArtAndCulture { get; set; }
	public int nTypeLink { get; set; }
	public int nSystemType { get; set; }
	public int? nArtAndCultureType { get; set; }
	public string? sDetailLink { get; set; }
	public string? sMode { get; set; }
}

public class ContentDetailItem
{
	public string sMode { get; set; } = string.Empty; // "Text", "Image", or "Youtube"
	public string? sContent { get; set; }
	public string? sImagePath { get; set; }
	public string? sYoutubeURL { get; set; }
	public string? sYoutubeID { get; set; }
}

public class RelateContentItem
{
	public Guid sID { get; set; }
	public string sImagePath { get; set; } = string.Empty;
	public string sTitle { get; set; } = string.Empty;
	public string? sDescription { get; set; }
	public Guid sLinkToID { get; set; }
	public int? nType { get; set; }
	public string? sLinkToURL { get; set; }
	public bool isBanner { get; set; }
}

public class TagItem
{
	public string sTagName { get; set; } = string.Empty;
}

//Result
public class ResultApi
{
	public int nStatusCode { get; set; } = 200;

	public string? sMessage { get; set; }
}
