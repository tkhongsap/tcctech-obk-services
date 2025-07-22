using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionList;
public class GetActionListQueryHandler : IQueryHandler<GetActionListQuery, GetActionListResult>
{

	IUnitOfWork _uow;
	public GetActionListQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetActionListResult> Handle(GetActionListQuery request, CancellationToken cancellationToken)
	{
		var actions = await _uow.ActionRepository.GetAll(request.ActionId, request.ActionTypeId, request.Filter, request.ActionIds, request);
		var totalCount = await _uow.ActionRepository.GetAllCount(request.ActionId, request.ActionTypeId, request.Filter, request.ActionIds);

		var res = new List<GetAction>();
		foreach (var item in actions)
		{
			var rs = new GetAction()
			{
				Id = item.Id,
				Name = item.Name,
				Description = item.Description!,
				ActionType = item.ActionType,
				MetaData = item.MetaData != null ? JsonConvert.DeserializeObject<GuardTourActionMetaDataResult>(item.MetaData)! : null!
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

		return new GetActionListResult(paginate, res);
	}
}
