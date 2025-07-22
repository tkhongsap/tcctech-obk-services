

using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Model;
public class ExploreModel
{
	public Guid? Id { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelate { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public List<string>? Tag { get; set; } = new List<string>();
	public ExploreLang Detail { get; set; } = new ExploreLang();
}


public class ExploreLang
{
	public ExploreDetail En { get; set; } = new ExploreDetail();
	public ExploreDetail Th { get; set; } = new ExploreDetail();
	public ExploreDetail Cn { get; set; } = new ExploreDetail();
}


public class ExploreDetail
{
	public string? Title { get; set; } = string.Empty;
	public string? ImageURL { get; set; }
	public string? FileName { get; set; }
	public string? OriginalFileName { get; set; }
	public string? HeaderImageURL { get; set; }
	public string? HeaderFileName { get; set; }
	public string? HeaderOriginalFileName { get; set; }
	public string? Related { get; set; } = string.Empty;
	public string? RelatedSub { get; set; } = string.Empty;
	public List<CmsContent> CMS { get; set; } = new List<CmsContent>();
}