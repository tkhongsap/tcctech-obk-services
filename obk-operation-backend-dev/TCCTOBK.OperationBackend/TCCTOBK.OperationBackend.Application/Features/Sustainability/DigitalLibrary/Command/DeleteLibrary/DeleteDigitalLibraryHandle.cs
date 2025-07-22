using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DeleteLibrary;

public class DeletelLibraryHandler : IRequestHandler<DeleteLibraryCommand, DeleteLibraryResult>
{
	IUnitOfWork _uow;
	public DeletelLibraryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<DeleteLibraryResult> Handle(DeleteLibraryCommand request, CancellationToken cancellationToken)
	{
		DeleteDigitalSustainability digital = new DeleteDigitalSustainability(request.Id);

		await _uow.SustainabilityRepository.DeleteDigitalLibrary(digital, request);
		await _uow.SaveChangeAsyncWithCommit();
		
		return new DeleteLibraryResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
