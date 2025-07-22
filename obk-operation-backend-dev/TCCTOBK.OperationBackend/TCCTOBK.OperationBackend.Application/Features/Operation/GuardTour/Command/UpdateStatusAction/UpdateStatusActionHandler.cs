using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.SubtaskActionRepository;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusAction;

public class UpdateStatusActionHandler : IRequestHandler<UpdateStatusActionCommand, UpdateStatusActionResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpdateStatusActionHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpdateStatusActionResult> Handle(UpdateStatusActionCommand request, CancellationToken cancellationToken)
	{
		var updateData = new UpdateSubtaskActionModel(request.AID, request.STID, request.Status, request.Remarks, request.Reading, request.MetaData, request.QrId);
		await _uow.SubtaskActionRepository.UpdateSubtaskAction(updateData, request);
		await _uow.SaveChangeAsyncWithCommit();

		return new UpdateStatusActionResult();
	}
}
