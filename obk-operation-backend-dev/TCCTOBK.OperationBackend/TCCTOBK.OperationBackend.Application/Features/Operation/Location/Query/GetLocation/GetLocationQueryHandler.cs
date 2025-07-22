using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetLocation;
public class GetLocationQueryHandler : IQueryHandler<GetLocationQuery, Location>
{
	IUnitOfWork _uow;
	public GetLocationQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<Location> Handle(GetLocationQuery request, CancellationToken cancellationToken)
	{
		var lid = new Guid(request.LID);
		return await _uow.LocationRepository.GetById(lid);
	}
}
