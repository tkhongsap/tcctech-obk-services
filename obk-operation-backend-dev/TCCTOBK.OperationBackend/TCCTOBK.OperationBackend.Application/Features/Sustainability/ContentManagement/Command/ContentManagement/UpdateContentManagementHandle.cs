using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.ContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagementManagement.Command.ContentManagement;

public class ContentManagementHandler : IRequestHandler<ContentManagementCommand, ContentManagementResult>
{
	IUnitOfWork _uow;
	public ContentManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<ContentManagementResult> Handle(ContentManagementCommand request, CancellationToken cancellationToken)
	{
		ContentManagementSustainability content = new ContentManagementSustainability(request.Status, request.IsSubMenu, request.IsShowRelatedLink, request.IsDelete, request.Order, request.Detail, request.Id, request.ParentId, request.LayoutType, request.IsDisabled);

		await _uow.SustainabilityRepository.UpdateContentManagement(content, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new ContentManagementResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
