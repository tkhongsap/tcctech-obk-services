using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionList;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetShiftList;
public class GetShiftListQueryHandler : IQueryHandler<GetShiftListQuery, GetShiftListResult>
{

	IUnitOfWork _uow;
	public GetShiftListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetShiftListResult> Handle(GetShiftListQuery request, CancellationToken cancellationToken)
	{
		var res = await _uow.ShiftRepository.Paginate(request.Name, request);
		var totalCount = await _uow.ShiftRepository.GetAllCount(request.Name, null, null);

		var paginate = new Paginate()
		{
			Count = res.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		return new GetShiftListResult(paginate, res);
	}
}
