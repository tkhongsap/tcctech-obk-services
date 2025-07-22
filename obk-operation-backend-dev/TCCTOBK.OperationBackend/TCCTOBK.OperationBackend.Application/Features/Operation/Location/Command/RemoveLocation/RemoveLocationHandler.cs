using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveLocation;
internal class RemoveLocationHandler : ICommandHandler<RemoveLocationCommand, int>
{
	private readonly IUnitOfWork _uow;

	public RemoveLocationHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<int> Handle(RemoveLocationCommand request, CancellationToken cancellationToken)
	{
		return await _uow.LocationRepository.RemoveLocation(request.LID);
	}
}
