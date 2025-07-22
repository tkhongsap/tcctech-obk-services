using MediatR;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;

public class DigitalLibraryHandler : IRequestHandler<DigitalLibraryCommand, DigitalLibraryResult>
{
	IUnitOfWork _uow;
	public DigitalLibraryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<DigitalLibraryResult> Handle(DigitalLibraryCommand request, CancellationToken cancellationToken)
	{
		DigitalSustainability digital = new DigitalSustainability(request.Status, request.Data.En, request.Data.Th,request.Data.Cn, request.Id);

		await _uow.SustainabilityRepository.UpdateDigitalLibrary(digital, request);
		await _uow.SaveChangeAsyncWithCommit();
		
		return new DigitalLibraryResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
