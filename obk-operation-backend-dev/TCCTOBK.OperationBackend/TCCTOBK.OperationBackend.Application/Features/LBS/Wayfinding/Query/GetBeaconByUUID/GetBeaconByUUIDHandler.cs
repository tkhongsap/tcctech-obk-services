using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.LBS.Wayfinding.Query.GetBeaconByUUID;

public class GetBeaconByUUIDHandler : IQueryHandler<GetBeaconByUUIDQuery, BeaconModel>
{
	private readonly IUnitOfWork _uow;

	public GetBeaconByUUIDHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<BeaconModel> Handle(GetBeaconByUUIDQuery request, CancellationToken cancellationToken)
	{
		var result = await _uow.BeaconRepository.GetBeaconByUUIDAsync(request.UUID);
		return result;
	}
}
