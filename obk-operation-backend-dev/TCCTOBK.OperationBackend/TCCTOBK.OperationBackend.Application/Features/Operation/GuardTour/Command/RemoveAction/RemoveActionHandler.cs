using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveAction;
internal class RemoveActionHandler : ICommandHandler<RemoveActionCommand, int>
{
	private readonly IUnitOfWork _uow;

	public RemoveActionHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<int> Handle(RemoveActionCommand request, CancellationToken cancellationToken)
	{
		return await _uow.ActionRepository.RemoveAction(request.AID);
	}
}
