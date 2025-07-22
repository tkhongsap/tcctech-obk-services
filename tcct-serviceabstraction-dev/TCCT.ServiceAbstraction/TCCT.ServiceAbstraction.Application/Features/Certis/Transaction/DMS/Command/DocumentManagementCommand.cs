using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
public class DocumentManagementCommand : ICommand<DocumentManagementResult>
{
	public int ObjectKey { get; set; }
	public string ObjectType { get; set; } = null!;
	public string Description { get; set; } = null!;
	public string SearchTags { get; set; } = null!;
	public string AttachmentType { get; set; } = null!;
	public string IsDefault { get; set; }
	public string IsHidden { get; set; }
	public IFormFile Image { get; set; }

	public DocumentManagementCommand(DocumentManagementRequest request)
	{
		ObjectKey = request.ObjectKey;
		ObjectType = request.ObjectType;
		Description = request.Description;
		SearchTags = request.SearchTags;
		AttachmentType = request.AttachmentType;
		IsDefault = request.IsDefault;
		IsHidden = request.IsHidden;
		Image = request.Image;
	}
}
