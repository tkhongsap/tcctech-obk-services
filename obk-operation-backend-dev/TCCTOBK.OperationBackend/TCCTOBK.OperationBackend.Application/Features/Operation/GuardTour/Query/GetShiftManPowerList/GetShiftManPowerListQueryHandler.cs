using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionList;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftManPowerList;
public class GetShiftManPowerListQueryHandler : IQueryHandler<GetShiftManPowerListQuery, GetShiftManPowerListResult>
{
	
	IUnitOfWork _uow;
	public GetShiftManPowerListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetShiftManPowerListResult> Handle(GetShiftManPowerListQuery request, CancellationToken cancellationToken)
	{
		var res = await _uow.ShiftManPowerRequestRepository.Paginate(request.Shift, null, request);
		var totalCount = await _uow.ShiftManPowerRequestRepository.GetAllCount(request.Shift, null, null);

		var paginate = new Paginate()
		{
			Count = res.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		return new GetShiftManPowerListResult(paginate, res);
	}
}
