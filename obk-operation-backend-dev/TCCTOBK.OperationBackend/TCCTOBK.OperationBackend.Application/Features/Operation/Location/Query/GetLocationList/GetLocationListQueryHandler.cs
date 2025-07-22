using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetLocationList;
public class GetLocationListQueryHandler : IQueryHandler<GetLocationListQuery, GetLocationListResult>
{
	
	IUnitOfWork _uow;
	public GetLocationListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetLocationListResult> Handle(GetLocationListQuery request, CancellationToken cancellationToken)
	{
		var locations = await _uow.LocationRepository.GetAll(request.LocationId, request.Filter, request.LocationIds, request.Types, request);
		var totalCount = await _uow.LocationRepository.GetAllCount(request.LocationId, request.Filter, request.LocationIds, request.Types);

		var paginate = new Paginate()
		{
			Count = locations.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		return new GetLocationListResult(paginate, locations);
	}
}
