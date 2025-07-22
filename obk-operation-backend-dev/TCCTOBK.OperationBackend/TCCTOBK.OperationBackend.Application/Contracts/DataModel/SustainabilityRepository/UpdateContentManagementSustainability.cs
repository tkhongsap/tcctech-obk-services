using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

namespace TCCTOBK.OperationBackend.Application;

public class ContentManagementSustainability
{
	public Guid? Id { get; set; }
	public Guid? ParentId { get; set; }
	public bool Status { get; set; }
	public bool IsSubMenu { get; set; }
	public bool IsShowRelatedLink { get; set; }
	public int? LayoutType { get; set; }
	public bool IsDelete { get; set; }
	public int Order { get; set; }
	public bool? IsDisabled { get; set; }
	public ContentManagementLang Detail { get; set; }

	public ContentManagementSustainability(bool status, bool isSubMenu, bool isShowRelatedLink, bool isDelete, int order, ContentManagementLang detail, Guid? id, Guid? parentId, int? layoutType,bool? isDisabled)
	{
		Id = id;
		ParentId = parentId;
		LayoutType = layoutType;
		Status = status;
		IsSubMenu = isSubMenu;
		IsShowRelatedLink = isShowRelatedLink;
		IsDelete = isDelete;
		Order = order;
		Detail = detail;
		IsDisabled = isDisabled;
	}
}