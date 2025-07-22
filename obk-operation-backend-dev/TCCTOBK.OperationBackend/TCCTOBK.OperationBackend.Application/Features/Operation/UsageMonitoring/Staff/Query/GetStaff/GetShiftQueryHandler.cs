using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaff;
public class GetStaffQueryHandler : IQueryHandler<GetStaffQuery, mtStaff>
{
	IUnitOfWork _uow;
	public GetStaffQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<mtStaff> Handle(GetStaffQuery request, CancellationToken cancellationToken)
	{

		return await _uow.StaffRepository.GetById(request.Sfid);
	}
}
