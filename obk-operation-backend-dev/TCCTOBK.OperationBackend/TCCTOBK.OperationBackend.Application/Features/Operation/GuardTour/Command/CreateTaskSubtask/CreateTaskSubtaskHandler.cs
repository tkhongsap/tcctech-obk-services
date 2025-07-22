using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskSubtaskRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateTaskSubtask;

internal class CreateTaskSubtaskHandler : IRequestHandler<CreateTaskSubtaskCommand, CreateTaskSubtaskResult>
{
	IUnitOfWork _uow;
	public CreateTaskSubtaskHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<CreateTaskSubtaskResult> Handle(CreateTaskSubtaskCommand request, CancellationToken cancellationToken)
	{
		var createTask = new CreateTaskModel(request.Name, request.StatusId, request.StartDate, request.EndDate, request.LocationId, request.MemberId);
		var taskId = await _uow.TaskRepository.CreateTask(createTask, request);
		List<CreateTaskSubtaskModel> listTaskSubtask = new List<CreateTaskSubtaskModel>();
		List<CreateSubtaskActionModel> listSubtaskAction = new List<CreateSubtaskActionModel>();
		foreach (var subtask in request.Subtasks)
		{
			foreach (var action in subtask.ActionIds)
			{
				await _uow.ActionRepository.GetById(action, false);
			}
			var subtaskId = await _uow.SubtaskRepository.CreateSubtask(subtask, request);
			listSubtaskAction.Add(new CreateSubtaskActionModel(subtaskId, subtask.ActionIds, subtask.StatusId));
			listTaskSubtask.Add(new CreateTaskSubtaskModel(taskId, subtaskId));
		}
		await _uow.SubtaskActionRepository.CreateSubtaskAction(listSubtaskAction, request);
		await _uow.TaskSubtaskRepository.CreateTaskSubtask(listTaskSubtask, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateTaskSubtaskResult() { Id = taskId };
	}
}