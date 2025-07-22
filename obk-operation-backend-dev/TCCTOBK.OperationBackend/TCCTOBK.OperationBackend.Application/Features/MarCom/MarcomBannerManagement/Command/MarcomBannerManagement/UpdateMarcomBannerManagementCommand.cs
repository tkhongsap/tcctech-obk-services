using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

public class MarcomBannerManagementCommand : AuditableModel, ICommand<MarcomBannerManagementResult>
{
	public Guid? Id { get; set; }
	public string BannerName { get; set; } = default!;
	public string? LinkToURL { get; set; }
	public bool Status { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public int Type { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public double Start { get; set; }
	public double? End { get; set; }
	public bool Alltime { get; set; }
	public MarcomBannerManagementLang Detail { get; set; } = new MarcomBannerManagementLang();
}

public class MarcomBannerManagementLang
{
	public MarcomBannerManagementDetail En { get; set; } = new MarcomBannerManagementDetail();
	public MarcomBannerManagementDetail Th { get; set; } = new MarcomBannerManagementDetail();
	public MarcomBannerManagementDetail Cn { get; set; } = new MarcomBannerManagementDetail();
}


public class MarcomBannerManagementDetail
{
	public string? Title { get; set; }
	public string? Text { get; set; }
	public bool? Type { get; set; }
	public string? ImageURL { get; set; }
	public string? FileName { get; set; }
	public string? OriginalFileName { get; set; }
	public string? HeaderImageURL { get; set; }
	public string? HeaderFileName { get; set; }
	public string? HeaderOriginalFileName { get; set; }
	public List<CmsContent> CMS { get; set; } = new List<CmsContent>();
	public List<string>? Tag { get; set; } = new List<string>();
}