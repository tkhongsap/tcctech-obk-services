using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActionTypeRepository;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpsertShiftManPowerCommand;

public class UpsertShiftManPowerCommandHandler : IRequestHandler<UpsertShiftManPowerCommandCommand, UpsertShiftManPowerCommandResult>
{
	IUnitOfWork _uow;
	IMailService _msr;
	public UpsertShiftManPowerCommandHandler(IUnitOfWork uow, IMailService msr)
	{
		_uow = uow;
		_msr = msr;
	}
	public async Task<UpsertShiftManPowerCommandResult> Handle(UpsertShiftManPowerCommandCommand request, CancellationToken cancellationToken)
	{

		var result = request.Id;
		if (request.Id != null)
		{
			await _uow.ShiftManPowerRequestRepository.GetById(request.Id ?? 0);
			await _uow.ShiftManPowerRequestRepository.UpdateShiftManPower(request, request);
		}
		else
		{
			var resultCreate = await _uow.ShiftManPowerRequestRepository.CreateShiftManPower(request, request);
			result = resultCreate;
		}

		await _uow.SaveChangeAsyncWithCommit();
		return new UpsertShiftManPowerCommandResult() { Id = result };
	}
}
