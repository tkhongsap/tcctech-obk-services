using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.ContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Command.DeleteContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DeleteContentManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagementManagement.Command.DeleteContentManagement;

public class ContentManagementHandler : IRequestHandler<DeleteContentManagementCommand, DeleteContentManagementResult>
{
	IUnitOfWork _uow;
	public ContentManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<DeleteContentManagementResult> Handle(DeleteContentManagementCommand request, CancellationToken cancellationToken)
	{
		DeleteContentManagementSustainability content = new DeleteContentManagementSustainability(request.Id);

		await _uow.SustainabilityRepository.DeleteContentManagement(content, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new DeleteContentManagementResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
