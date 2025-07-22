using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskSubtaskRepository;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskSubtask;

internal class UpdateTaskSubtaskHandler : IRequestHandler<UpdateTaskSubtaskCommand, UpdateTaskSubtaskResult>
{
	IUnitOfWork _uow;
	public UpdateTaskSubtaskHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpdateTaskSubtaskResult> Handle(UpdateTaskSubtaskCommand request, CancellationToken cancellationToken)
	{
		var updateTask = new UpdateTaskModel(request.TID, request.Name, request.StatusId, request.StartDate, request.EndDate, request.LocationId, request.MemberId, null, null, null);
		await _uow.TaskRepository.UpdateTaskById(updateTask, request);
		var subtasksData = await _uow.TaskSubtaskRepository.GetAll(request.TID, null, false);
		List<Guid> subtaskIds = new List<Guid>();
		foreach (var data in subtasksData) {
			subtaskIds.Add(data.Subtask);
		}
		await _uow.SubtaskActionRepository.RemoveSubtaskActions(subtaskIds);
		await _uow.SubtaskRepository.RemoveSubtask(subtaskIds);
		await _uow.TaskSubtaskRepository.RemoveTaskSubtasks(request.TID);
		List<CreateTaskSubtaskModel> listTaskSubtask = new List<CreateTaskSubtaskModel>();
		List<CreateSubtaskActionModel> listSubtaskAction = new List<CreateSubtaskActionModel>();
		foreach (var subtask in request.Subtasks) {
			foreach (var action in subtask.ActionIds) {
				await _uow.ActionRepository.GetById(action, false);
			}
			var subtaskId = await _uow.SubtaskRepository.CreateSubtask(subtask, request);
			listSubtaskAction.Add(new CreateSubtaskActionModel(subtaskId, subtask.ActionIds, subtask.StatusId));
			listTaskSubtask.Add(new CreateTaskSubtaskModel(request.TID, subtaskId));
		}
		await _uow.SubtaskActionRepository.CreateSubtaskAction(listSubtaskAction, request);
		await _uow.TaskSubtaskRepository.CreateTaskSubtask(listTaskSubtask, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateTaskSubtaskResult();
	}
}