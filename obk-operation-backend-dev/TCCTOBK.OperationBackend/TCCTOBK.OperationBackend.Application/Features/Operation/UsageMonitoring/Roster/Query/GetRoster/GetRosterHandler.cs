using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRoster;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Feature.Operation.UsageMonitoring.Roster.Query.GetRoster;
public class GetRosterHandler : IQueryHandler<GetRosterQuery, trRoster>
{
	IUnitOfWork _uow;
	public GetRosterHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<trRoster> Handle(GetRosterQuery request, CancellationToken cancellationToken)
	{

		return await _uow.RosterRepository.GetById(request.Roid);
	}
}
