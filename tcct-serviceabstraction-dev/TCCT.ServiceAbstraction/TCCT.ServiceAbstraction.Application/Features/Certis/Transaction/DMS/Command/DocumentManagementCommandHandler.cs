using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Command;
public class DocumentManagementCommandHandler : ICommandHandler<DocumentManagementCommand, DocumentManagementResult>
{
	private readonly ICertisService _certisservice;
	public DocumentManagementCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<DocumentManagementResult> Handle(DocumentManagementCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.DMSService.PostDocumentManagement(request.ObjectKey, request.ObjectType, request.Description, request.SearchTags, request.AttachmentType, request.IsDefault, request.IsHidden, request.Image);
		return res;
	}
}
