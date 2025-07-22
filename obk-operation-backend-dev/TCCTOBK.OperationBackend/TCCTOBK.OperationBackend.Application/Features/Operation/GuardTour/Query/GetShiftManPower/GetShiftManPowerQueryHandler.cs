using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftManPower;
public class GetShiftManPowerQueryHandler : IQueryHandler<GetShiftManPowerQuery, mtShiftManPowerRequest>
{
	IUnitOfWork _uow;
	public GetShiftManPowerQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<mtShiftManPowerRequest> Handle(GetShiftManPowerQuery request, CancellationToken cancellationToken)
	{

		return await _uow.ShiftManPowerRequestRepository.GetById(request.Id);
	}
}
