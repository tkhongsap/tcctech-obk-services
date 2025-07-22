using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.DeletePRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagementManagement.Command.PRBannerManagement;

public class DeletePRBannerManagementHandler : IRequestHandler<DeletePRBannerManagementCommand, DeletePRBannerManagementResult>
{
	IUnitOfWork _uow;
	public DeletePRBannerManagementHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<DeletePRBannerManagementResult> Handle(DeletePRBannerManagementCommand request, CancellationToken cancellationToken)
	{
		DeleteBannerSustainability content = new DeleteBannerSustainability(request.Id);

		await _uow.SustainabilityRepository.DeletePRBanner(content, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new DeletePRBannerManagementResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
