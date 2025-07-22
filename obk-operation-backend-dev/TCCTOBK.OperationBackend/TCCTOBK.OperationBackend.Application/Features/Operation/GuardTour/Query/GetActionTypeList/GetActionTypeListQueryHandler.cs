using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionTypeList;
public class GetActionTypeListQueryHandler : IQueryHandler<GetActionTypeListQuery, GetActionTypeListResult>
{
	
	IUnitOfWork _uow;
	public GetActionTypeListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetActionTypeListResult> Handle(GetActionTypeListQuery request, CancellationToken cancellationToken)
	{
		var actionTypes = await _uow.ActionTypeRepository.GetAll(request.ActionTypeId, request.Filter, request.ActionTypeIds, request);
		var totalCount = await _uow.ActionTypeRepository.GetAllCount(request.ActionTypeId, request.Filter, request.ActionTypeIds);

		var res = new List<GetActionType>();
		foreach (var item in actionTypes)
		{
			var rs = new GetActionType()
			{
				Id = item.Id,
				Action = item.Action
			};
			res.Add(rs);
		}

		var paginate = new Paginate()
		{
			Count = res.Count,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		return new GetActionTypeListResult(paginate, res);
	}
}
