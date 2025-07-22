using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckDuplicateActivityProcedure;

public class CheckDuplicateActivityProcedureHandler : IQueryHandler<CheckDuplicateActivityProcedureQuery, CheckDuplicateActivityProcedureResult>
{
	private readonly IUnitOfWork _uow;

	public CheckDuplicateActivityProcedureHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<CheckDuplicateActivityProcedureResult> Handle(CheckDuplicateActivityProcedureQuery request, CancellationToken cancellationToken)
	{
		var isDuplicate = await _uow.ActivityProcedureRepository.CheckDuplicate(request.Code);
		string? message = null;
		if (isDuplicate)
		{
			message = $"Route name is {request.Code} already exists.";
		}

		var result = new CheckDuplicateActivityProcedureResult(message);
		return result;
	}
}
