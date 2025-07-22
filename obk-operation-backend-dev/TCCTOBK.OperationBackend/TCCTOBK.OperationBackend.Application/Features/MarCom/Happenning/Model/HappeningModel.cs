

using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Model;
public class HappeningModel
{
	public Guid? Id { get; set; }
	public Guid? Parent { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelate { get; set; }
	public bool IsArtC { get; set; }
	public bool IsDelete { get; set; }
	public bool IsCategory { get; set; }
	public bool IsHasSub { get; set; }
	public bool IsPin { get; set; }
	public int Order { get; set; }
	public double? Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public double? StartEvent { get; set; }
	public double? EndEvent { get; set; }
	public string? LinkToURL {get;set;}
	public int Type { get; set; }
	public int SystemType { get; set; }
	public int ArtType { get; set; }

	public List<string>? Tag { get; set; } = new List<string>();

	public HappeningLang Detail { get; set; } = new HappeningLang();
}


public class HappeningLang
{
	public HappeningDetail En { get; set; } = new HappeningDetail();
	public HappeningDetail Th { get; set; } = new HappeningDetail();
	public HappeningDetail Cn { get; set; } = new HappeningDetail();
}


public class HappeningDetail
{
	public string? Title { get; set; } = string.Empty;
	public string? Introduce { get; set; } = string.Empty;
	public string? ImageURL { get; set; }
	public string? FileName { get; set; }
	public string? OriginalFileName { get; set; }
	public string? HeaderImageURL { get; set; }
	public string? HeaderFileName { get; set; }
	public string? HeaderOriginalFileName { get; set; }
	public string? Text { get; set; }
	public string? Location { get; set; } = string.Empty;
	public string? Related { get; set; } = string.Empty;
	public string? RelatedSub { get; set; } = string.Empty;
	public List<CmsContent> CMS { get; set; } = new List<CmsContent>();
}