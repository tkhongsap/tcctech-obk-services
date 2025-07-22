using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShift;
public class GetShiftQueryHandler : IQueryHandler<GetShiftQuery, mtShift>
{
	IUnitOfWork _uow;
	public GetShiftQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<mtShift> Handle(GetShiftQuery request, CancellationToken cancellationToken)
	{

		return await _uow.ShiftRepository.GetById(request.Id);
	}
}
