using MediatR;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActivityProcedureRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateActivityProcedure;

internal class UpdateActivityProcedureHandler : IRequestHandler<UpdateActivityProcedureCommand, UpdateActivityProcedureResult>
{
	IUnitOfWork _uow;
	public UpdateActivityProcedureHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<UpdateActivityProcedureResult> Handle(UpdateActivityProcedureCommand request, CancellationToken cancellationToken)
	{
		var subtaskActions = JsonConvert.SerializeObject(request.SubtaskActions);
		var updateAP = new UpdateActivityProcedureModel()
		{
			Id = request.Id,
			Code = request.Code,
			TaskName = request.TaskName,
			SubtaskActions = subtaskActions,
			LocationId = request.LocationId,
		};
		await _uow.ActivityProcedureRepository.UpdateActivityProcedure(updateAP, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateActivityProcedureResult();
	}
}