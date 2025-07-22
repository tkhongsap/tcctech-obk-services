using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveShiftManPower;
internal class RemoveShiftManPowerHandler : ICommandHandler<RemoveShiftManPowerCommand, int>
{
	private readonly IUnitOfWork _uow;

	public RemoveShiftManPowerHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<int> Handle(RemoveShiftManPowerCommand request, CancellationToken cancellationToken)
	{
		return await _uow.ShiftManPowerRequestRepository.DeleteShiftManPower(request.MPID);
	}
}
