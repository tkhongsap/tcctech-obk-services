using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

public class GetAllDigitalLibraryHandler : IQueryHandler<GetAllDigitalLibraryQuery, GetAllDigitalLibraryResult>
{
	IUnitOfWork _uow;
	public GetAllDigitalLibraryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetAllDigitalLibraryResult> Handle(GetAllDigitalLibraryQuery request, CancellationToken cancellationToken)
	{
		var digital = await _uow.SustainabilityRepository.GetAllDigitalLibrary(request.Filter, request.Status, request);
		var result = new GetAllDigitalLibraryResult();


		result.Data = digital;
		result.StatusCode = StatusCodes.Status200OK;
		return result;
	}
}
