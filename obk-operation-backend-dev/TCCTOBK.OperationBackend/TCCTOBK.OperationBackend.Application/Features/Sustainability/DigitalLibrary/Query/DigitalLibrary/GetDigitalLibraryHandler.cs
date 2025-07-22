using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetDigitalLibrary;

public class GetDigitalLibraryHandler : IQueryHandler<GetDigitalLibraryQuery, GetDigitalLibraryResult>
{
	IUnitOfWork _uow;
	public GetDigitalLibraryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetDigitalLibraryResult> Handle(GetDigitalLibraryQuery request, CancellationToken cancellationToken)
	{
		DigitalLibraryByIdResult digital = await _uow.SustainabilityRepository.GetDigitalLibraryById(request.DLID);
		GetDigitalLibraryResult result = new GetDigitalLibraryResult();

		result.Data = digital;
		result.StatusCode = StatusCodes.Status200OK;
		return result;
	}
}
