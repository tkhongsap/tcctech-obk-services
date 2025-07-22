using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetBeaconsList;

public class GetBeaconsListHandler : IQueryHandler<GetBeaconsListQuery, GetBeaconsListResult>
{
	private readonly IUnitOfWork _uow;

	public GetBeaconsListHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<GetBeaconsListResult> Handle(GetBeaconsListQuery request, CancellationToken cancellationToken)
	{
		var result = await _uow.BeaconRepository.GetBeaconsListAsync();
		return new GetBeaconsListResult { Data = result };
	}
}
