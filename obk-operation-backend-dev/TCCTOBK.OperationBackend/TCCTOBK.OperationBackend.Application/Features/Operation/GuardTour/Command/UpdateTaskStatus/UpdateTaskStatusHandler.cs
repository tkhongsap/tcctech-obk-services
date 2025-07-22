using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskStatus;

internal class UpdateTaskStatusHandler : IRequestHandler<UpdateTaskStatusCommand, UpdateTaskStatusResult>
{
	IUnitOfWork _uow;
	public UpdateTaskStatusHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpdateTaskStatusResult> Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
	{
		var dataTask = await _uow.TaskRepository.GetById(request.TID, false);
		var completeDate = null as DateTime?;
		var isLate = null as bool?;
		if (request.StatusId == Constant.GUARD_TOUR_STATUS_COMPLETED || request.StatusId == Constant.GUARD_TOUR_STATUS_SKIP)
		{
			completeDate = DateTime.Now.ToUniversalTime();
			var checkedDate = completeDate?.AddHours(7);
			if (dataTask.EndDate != null && dataTask.EndDate < checkedDate)
			{
				isLate = true;
			}
			else
			{
				isLate = false;
			}
		}
		var acknowledgeDate = null as DateTime?;
		if (request.StatusId == Constant.GUARD_TOUR_STATUS_INPROGRESS)
		{
			acknowledgeDate = DateTime.Now.ToUniversalTime();
		}
		var updateData = new UpdateTaskModel(request.TID, null, request.StatusId, null, null, Guid.Empty, Guid.Empty, completeDate, isLate, acknowledgeDate, request.CancelReason);
		await _uow.TaskRepository.UpdateTaskById(updateData, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateTaskStatusResult();
	}
}