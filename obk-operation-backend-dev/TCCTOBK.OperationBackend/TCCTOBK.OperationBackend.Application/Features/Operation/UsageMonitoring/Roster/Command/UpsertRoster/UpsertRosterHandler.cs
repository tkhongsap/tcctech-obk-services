using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.UpsertRoster;

public class UpsertRosterHandler : IRequestHandler<UpsertRosterCommand, string>
{
	IUnitOfWork _uow;
	public UpsertRosterHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<string> Handle(UpsertRosterCommand request, CancellationToken cancellationToken)
	{

		await _uow.RosterRepository.UpsertRoster(request);

		await _uow.SaveChangeAsyncWithCommit();
		return "Success";
	}
}
