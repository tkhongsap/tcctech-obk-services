using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ShiftRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateShift;

public class UpdateShiftHandler : IRequestHandler<UpdateShiftCommand, UpdateShiftResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpdateShiftHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpdateShiftResult> Handle(UpdateShiftCommand request, CancellationToken cancellationToken)
	{
		var createaction = new UpdateShiftModel(request.Id, request.Name, request.StartTime, request.EndTime, request.AllowCheckInStart, request.AllowCheckInEnd, request.CheckoutTimeEnd, request.IsOverNight);
		await _uow.ShiftRepository.UpdateShift(createaction, request);
		await _uow.SaveChangeAsyncWithCommit();
		return new UpdateShiftResult();
	}
}
