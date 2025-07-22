
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Model;
public class ContentManagementModel
{
	public Guid? Id { get; set; }
	public Guid? ParentId { get; set; }
	public bool Status { get; set; }
	public bool IsSubMenu { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public int? LayoutType { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public ContentManagementLang Detail { get; set; } = new ContentManagementLang();
	public bool? IsDisabled { get; set; }
}
