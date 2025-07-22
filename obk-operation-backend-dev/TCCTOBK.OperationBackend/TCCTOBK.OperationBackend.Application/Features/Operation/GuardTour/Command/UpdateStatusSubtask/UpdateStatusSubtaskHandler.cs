using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskRepository;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusSubtask;

public class UpdateStatusSubtaskHandler : IRequestHandler<UpdateStatusSubtaskCommand, UpdateStatusSubtaskResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpdateStatusSubtaskHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpdateStatusSubtaskResult> Handle(UpdateStatusSubtaskCommand request, CancellationToken cancellationToken)
	{
		var updateData = new UpdateSubtaskModel(request.STID, null, request.Status, request.Remarks);
		if (request.Status == Constant.GUARD_TOUR_STATUS_SKIP) {
			var countRequired = await _uow.SubtaskActionRepository.GetAll(request.STID, null, true, Constant.GUARD_TOUR_STATUS_ASSIGNED, true);
			if (countRequired.Count > 0 && request.Remarks == null) {
				throw new BadRequestException("Remarks is required");
			}
			await _uow.SubtaskActionRepository.UpdateSubtaskActionsStatus(request.STID, Constant.GUARD_TOUR_STATUS_ASSIGNED, request.Status, request);
		}
		await _uow.SubtaskRepository.UpdateSubtask(updateData, request);

		await _uow.SaveChangeAsyncWithCommit();

		return new UpdateStatusSubtaskResult();
	}
}
