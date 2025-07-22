using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveSchedulePlan;
internal class RemoveSchedulePlanHandler : ICommandHandler<RemoveSchedulePlanCommand, int>
{
	private readonly IUnitOfWork _uow;

	public RemoveSchedulePlanHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<int> Handle(RemoveSchedulePlanCommand request, CancellationToken cancellationToken)
	{
		return await _uow.SchedulePlanRepository.RemoveSchedulePlan(request.SDPID);
	}
}
