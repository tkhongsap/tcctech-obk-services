using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveActionType;
internal class RemoveActionTypeHandler : ICommandHandler<RemoveActionTypeCommand, int>
{
	private readonly IUnitOfWork _uow;

	public RemoveActionTypeHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<int> Handle(RemoveActionTypeCommand request, CancellationToken cancellationToken)
	{
		return await _uow.ActionTypeRepository.RemoveActionType(request.ATID);
	}
}
