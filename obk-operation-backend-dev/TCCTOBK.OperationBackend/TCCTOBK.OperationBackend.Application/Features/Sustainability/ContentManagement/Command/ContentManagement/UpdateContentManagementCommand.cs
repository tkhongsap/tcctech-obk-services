using System.Reflection.Metadata;
using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.ContentManagement;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

public class ContentManagementCommand : AuditableModel, ICommand<ContentManagementResult>
{
	public Guid? Id { get; set; }
	public Guid? ParentId { get; set; }
	public bool Status { get; set; }
	public bool IsSubMenu { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public bool? IsDisabled { get; set; }
	public int? LayoutType { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public ContentManagementLang Detail { get; set; } = new ContentManagementLang();
}

public class ContentManagementLang
{
	public ContentManagementDetail En { get; set; } = new ContentManagementDetail();
	public ContentManagementDetail Th { get; set; } = new ContentManagementDetail();
	public ContentManagementDetail Cn { get; set; } = new ContentManagementDetail();
}


public class ContentManagementDetail
{
	public string? Menu { get; set; }
	public string? Introduce { get; set; }
	public string? TitleRelated { get; set; }
	public string? Text { get; set; }
	public string? CoverImageURL { get; set; }
	public string? CoverFileName { get; set; }
	public string? CoverOriginalFileName { get; set; }
	public string? HeadImageURL { get; set; }
	public string? HeadFileName { get; set; }
	public string? HeadOriginalFileName { get; set; }
	public List<CmsContent> CMS { get; set; } = new List<CmsContent>();
	public List<string>? Tag { get; set; } = new List<string>();
}

public class CmsContent
{
	public Guid? Id { get; set; }
	public Guid? MenuId { get; set; }
	public string? Language { get; set; }
	public int? ContentType { get; set; }
	public int? Order { get; set; }
	public string? Text { get; set; }
	public string? ImageURL { get; set; }
	public string? FileName { get; set; }
	public string? OriginalFileName { get; set; }
	public string? YoutubeURL { get; set; }
	public bool IsActive { get; set; }
	public bool IsDelete { get; set; }
}