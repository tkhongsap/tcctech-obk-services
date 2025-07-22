
namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.GetMainContent;
public class GetContent
{
	public string sLanguage { get; set; } = "en";
}

//Main Page
public class GetMainContentResult : ResultApi
{
	public List<EventItem> lstEvent { get; set; } = new();
	public List<BannerItem> lstBanner { get; set; } = new();
	public List<ContentCardWhatHappenItem> lstWhatHappen { get; set; } = new();
	public List<ContentCardExploreItem> lstExplore { get; set; } = new();
	public int nTimeSlideBanner { get; set; }
	public bool canCheckDontShowEvent { get; set; }
}

public class EventItem
{
	public Guid sID { get; set; }
	public string sImagePath { get; set; } = string.Empty;
	public bool isShowDontShowAgain { get; set; }
}
public class EventItemCatch
{
	public Guid sID { get; set; }
	public string sImagePathEN { get; set; } = string.Empty;
	public string sImagePathTH { get; set; } = string.Empty;
	public string sImagePathCN { get; set; } = string.Empty;
	public bool isShowDontShowAgain { get; set; }
}

public class BannerItem
{
	public string sImagePath { get; set; } = string.Empty;
	public bool isImage { get; set; }
	public int nType { get; set; }
	public Guid sID { get; set; }
	public string? sLinkToURL { get; set; }
	public string? sText { get; set; }
}

public class BannerItemCatch
{
	public string sImagePathEN { get; set; } = string.Empty;
	public string sImagePathTH { get; set; } = string.Empty;
	public string sImagePathCN { get; set; } = string.Empty;
	public bool isImageEN { get; set; }
	public bool isImageTH { get; set; }
	public bool isImageCN { get; set; }
	public int nType { get; set; }
	public Guid sID { get; set; }
	public string? sLinkToURL { get; set; }
	public string? sTextEN { get; set; }
	public string? sTextTH { get; set; }
	public string? sTextCN { get; set; }
}
public class ContentCardWhatHappenItem
{
	public Guid sID { get; set; }
	public Guid sCategolyID { get; set; }
	public string sCategory { get; set; } = string.Empty;
	public string sTitle { get; set; } = string.Empty;
	public string sLocation { get; set; } = string.Empty;
	public string sDate { get; set; } = string.Empty;
	public string sCoverImagePath { get; set; } = string.Empty;
	public DateTime? dStart { get; set; }
	public DateTime? dEnd { get; set; }
}

public class ContentCardWhatHappenItemCatch
{
	public Guid sID { get; set; }
	public Guid sCategolyID { get; set; }
	public string sCategoryEN { get; set; } = string.Empty;
	public string sCategoryTH { get; set; } = string.Empty;
	public string sCategoryCN { get; set; } = string.Empty;
	public string sTitleEN { get; set; } = string.Empty;
	public string sTitleTH { get; set; } = string.Empty;
	public string sTitleCN { get; set; } = string.Empty;
	public string sLocationEN { get; set; } = string.Empty;
	public string sLocationTH { get; set; } = string.Empty;
	public string sLocationCN { get; set; } = string.Empty;
	public string sDate { get; set; } = string.Empty;
	public string sCoverImagePathEN { get; set; } = string.Empty;
	public string sCoverImagePathTH { get; set; } = string.Empty;
	public string sCoverImagePathCN { get; set; } = string.Empty;
	public DateTime? dStart { get; set; }
	public DateTime? dEnd { get; set; }
}

public class ContentCardExploreItem
{
	public Guid sID { get; set; }
	public string sCoverImagePath { get; set; } = string.Empty;
	public string sTitle { get; set; } = string.Empty;
}

public class ContentCardExploreItemCatch
{
	public Guid sID { get; set; }
	public string sCoverImagePathEN { get; set; } = string.Empty;
	public string sCoverImagePathTH { get; set; } = string.Empty;
	public string sCoverImagePathCN { get; set; } = string.Empty;
	public string sTitleEN { get; set; } = string.Empty;
	public string sTitleTH { get; set; } = string.Empty;
	public string sTitleCN { get; set; } = string.Empty;
}

//Result
public class ResultApi
{
	public int nStatusCode { get; set; } = 200;

	public string? sMessage { get; set; }
}
