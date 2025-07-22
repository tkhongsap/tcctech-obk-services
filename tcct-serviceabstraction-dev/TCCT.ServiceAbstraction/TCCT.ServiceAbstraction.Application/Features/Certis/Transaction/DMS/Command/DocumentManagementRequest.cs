using Microsoft.AspNetCore.Http;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
public class DocumentManagementRequest
{
	public int ObjectKey { get; set; }
	public string ObjectType { get; set; } = null!;
	public string Description { get; set; } = null!;
	public string SearchTags { get; set; } = null;
	public string AttachmentType { get; set; } = null!;
	public string IsDefault { get; set; }
	public string IsHidden { get; set; }
	public IFormFile Image { get; set; } = null!;

	public DocumentManagementRequest() { }

	public DocumentManagementRequest(int objectKey, string objectType, string description, string searchTags, string attachmentType, string isDefault, string isHidden, IFormFile image)
	{
		ObjectKey = objectKey;
		ObjectType = objectType;
		Description = description;
		SearchTags = searchTags;
		AttachmentType = attachmentType;
		IsDefault = isDefault;
		IsHidden = isHidden;
		Image = image;
	}
}
