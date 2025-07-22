using System.Collections.Generic;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionType;
public class GetActionTypeQueryHandler : IQueryHandler<GetActionTypeQuery, GetActionTypeResult>
{
	IUnitOfWork _uow;
	public GetActionTypeQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetActionTypeResult> Handle(GetActionTypeQuery request, CancellationToken cancellationToken)
	{
		var atid = new Guid(request.ATID);
		var actionData = await _uow.ActionTypeRepository.GetById(atid);

		var res = new GetActionTypeResult()
		{
			Id = actionData.Id,
			Action = actionData.Action
		};

		return res;
	}
}
