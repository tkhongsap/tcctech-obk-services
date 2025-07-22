using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Exceptions;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.RemoveRoster;
internal class RemoveRosterHandler : ICommandHandler<RemoveRosterCommand, Guid>
{
	private readonly IUnitOfWork _uow;

	public RemoveRosterHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}

	public async Task<Guid> Handle(RemoveRosterCommand request, CancellationToken cancellationToken)
	{
		var roster = await _uow.RosterRepository.GetById(request.Id);
		if (roster == null)
		{
			throw new NotFoundException("ไม่พบ Roster");
		}
		await _uow.RosterRepository.DeleteRoster(request.Id);
		await _uow.SaveChangeAsyncWithCommit();
		return request.Id;
	}
}
