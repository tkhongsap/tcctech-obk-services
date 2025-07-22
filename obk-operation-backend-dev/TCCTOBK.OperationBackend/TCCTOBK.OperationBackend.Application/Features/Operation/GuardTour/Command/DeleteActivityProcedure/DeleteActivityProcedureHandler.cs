using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.DeleteActivityProcedure;

internal class DeleteActivityProcedureHandler : IRequestHandler<DeleteActivityProcedureCommand, DeleteActivityProcedureResult>
{
	IUnitOfWork _uow;
	public DeleteActivityProcedureHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<DeleteActivityProcedureResult> Handle(DeleteActivityProcedureCommand request, CancellationToken cancellationToken)
	{
		await _uow.ActivityProcedureRepository.DeleteActivityProcedure(request.Id, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new DeleteActivityProcedureResult();
	}
}