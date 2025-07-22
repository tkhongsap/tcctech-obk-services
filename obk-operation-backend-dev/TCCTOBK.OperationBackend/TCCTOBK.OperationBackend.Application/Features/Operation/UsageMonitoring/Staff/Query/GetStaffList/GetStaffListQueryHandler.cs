
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.GetStaffList;
public class GetStaffListQueryHandler : IQueryHandler<GetStaffListQuery, GetStaffListResult>
{

	IUnitOfWork _uow;
	public GetStaffListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetStaffListResult> Handle(GetStaffListQuery request, CancellationToken cancellationToken)
	{
		var res = await _uow.StaffRepository.Paginate(request.StaffName, request.Component, request.MustUseOpsApp, request);
		var totalCount = await _uow.StaffRepository.GetAllCount(request.StaffName, request.Component, null, null, null);

		var paginate = new Paginate()
		{
			Count = res.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		return new GetStaffListResult(paginate, res);
	}
}
