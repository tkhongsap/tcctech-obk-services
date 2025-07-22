
namespace TCCTOBK.OperationBackend.Application.Features.SustainabilityMobile.Query.GetMainContent;
public class GetContent
{
	public string sLanguage { get; set; } = "en";
}

public class GetMainContentResult : ResultApi
{
	public BannerItem objBanner { get; set; } = new();
	public List<MainContentItem> lstMainContent { get; set; } = new();
}

//Banner
public class BannerItem
{
	public List<BannerAItem> lstBannerA { get; set; } = new();
	public string sPathBannerRole1B { get; set; } = string.Empty;
	public string? sTextBannerRole1B1 { get; set; } = string.Empty;
	public string? sTextBannerRole1B2 { get; set; } = string.Empty;

	public string sPathBannerRole2B { get; set; } = string.Empty;
	public string? sTextBannerRole2B1 { get; set; } = string.Empty;
	public string? sTextBannerRole2B2 { get; set; } = string.Empty;

	public string sPathBannerC { get; set; } = string.Empty;
	public string? sTextBannerC1 { get; set; } = string.Empty;
	public string? sTextBannerC2 { get; set; } = string.Empty;

	public string sPathCoverLayoutC { get; set; } = string.Empty;
	public int nTimeSlideBanner { get; set; }
}
public class BannerAItem
{
	public string sImagePath { get; set; } = string.Empty;
	public int nType { get; set; }
	public Guid sID { get; set; }
	public string? sLinkToURL { get; set; } = string.Empty;
	public string? sText { get; set; } = string.Empty;
}

//Main Content
public class MainContentItem
{
	public int nLayoutType { get; set; }
	public string sTitle { get; set; } = string.Empty;
	public string? sIntroduce { get; set; }
	public string? sLayoutBackground { get; set; }
	public List<SubContentItem> lstSub { get; set; } = new();
}
public class SubContentItem
{
	public Guid sID { get; set; }
	public string sPath { get; set; } = string.Empty;
	public string sLabel { get; set; } = string.Empty;
	public string? sLabelDesc { get; set; }
}

//Digital Library
public class ContentDigital
{
	public string sTitle { get; set; } = string.Empty;
	public string sSubTitle { get; set; } = string.Empty;
	public string sIntroduce { get; set; } = string.Empty;
	public List<DigitalCategoryItem> lstCategory { get; set; } = new();
}

public class DigitalCategoryItem
{
	public Guid sID { get; set; }
	public string sLabel { get; set; } = string.Empty;
}
public class ContentFileDownload
{
	public string sHeaderNav { get; set; } = string.Empty;
	public string sTitle { get; set; } = string.Empty;
	public List<FileDownloadItem> lstFile { get; set; } = new();
}
public class FileDownloadItem
{
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
