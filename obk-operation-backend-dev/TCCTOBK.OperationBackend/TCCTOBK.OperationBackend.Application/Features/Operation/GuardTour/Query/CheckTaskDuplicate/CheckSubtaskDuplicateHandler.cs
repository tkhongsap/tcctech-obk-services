using System;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.CheckSubtaskDuplicate;

public class CheckTaskDuplicateHandler : IQueryHandler<CheckTaskDuplicateQuery, CheckTaskDuplicateResult>
{
	private readonly IUnitOfWork _uow;

	public CheckTaskDuplicateHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<CheckTaskDuplicateResult> Handle(CheckTaskDuplicateQuery request, CancellationToken cancellationToken)
	{
		bool isDuplicate;
		if (request.Id != null)
		{
			isDuplicate = await _uow.TaskRepository.CheckDuplicate(request.Id.Value, request.Name);
		}
		else
		{
			isDuplicate = await _uow.TaskRepository.CheckDuplicate(request.Name);
		}
		string? message = isDuplicate ? $"Name is {request.Name} already exists." : null;
		var result = new CheckTaskDuplicateResult(message);
		return result;
	}
}
