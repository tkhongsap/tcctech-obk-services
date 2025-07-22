using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveShift;
internal class RemoveShiftHandler : ICommandHandler<RemoveShiftCommand, int>
{
	private readonly IUnitOfWork _uow;

	public RemoveShiftHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<int> Handle(RemoveShiftCommand request, CancellationToken cancellationToken)
	{
		return await _uow.ShiftRepository.DeleteShift(request.Id);
	}
}
