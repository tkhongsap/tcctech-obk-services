using System.Collections.Generic;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetAction;
public class GetActionQueryHandler : IQueryHandler<GetActionQuery, GetActionResult>
{
	IUnitOfWork _uow;
	public GetActionQueryHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<GetActionResult> Handle(GetActionQuery request, CancellationToken cancellationToken)
	{
		var aid = new Guid(request.AID);
		var actionData = await _uow.ActionRepository.GetById(aid, request.Scope);

		var res = new GetActionResult()
		{
			Id = actionData.Id,
			Name = actionData.Name,
			Description = actionData.Description,
			ActionTypeId = actionData.ActionType,
			MetaData = actionData.MetaData != null ? JsonConvert.DeserializeObject<GuardTourActionMetaDataResult>(actionData.MetaData)! : null!,
			ActionType = actionData.mtActionType
		};

		return res;
	}
}
