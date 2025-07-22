using MediatR;
using Newtonsoft.Json;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActivityProcedureRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActivityProcedure;

internal class CreateActivityProcedureHandler : IRequestHandler<CreateActivityProcedureCommand, CreateActivityProcedureResult>
{
	IUnitOfWork _uow;
	public CreateActivityProcedureHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<CreateActivityProcedureResult> Handle(CreateActivityProcedureCommand request, CancellationToken cancellationToken)
	{
		var subtaskActions = JsonConvert.SerializeObject(request.SubtaskActions);
		var createAP = new CreateActivityProcedureModel(request.Code, request.TaskName, subtaskActions, request.LocationId);
		await _uow.ActivityProcedureRepository.CreateActivityProcedure(createAP, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new CreateActivityProcedureResult();
	}
}