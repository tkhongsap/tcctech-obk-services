using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterList;
public class GetRosterListHandler : IQueryHandler<GetRosterListQuery, GetRosterListResult>
{
	IUnitOfWork _uow;
	public GetRosterListHandler(IUnitOfWork uow)
	{
		_uow = uow;

	}
	public async Task<GetRosterListResult> Handle(GetRosterListQuery request, CancellationToken cancellationToken)
	{
		var res = await _uow.RosterRepository.Paginate(request.Component, request);
		var totalCount = await _uow.RosterRepository.GetAllCount(request.Component, null, null);

		var paginate = new Paginate()
		{
			Count = 1,
			Page = request.Page != 0 ? request.Page : 1,
			Limit = request.Rows,
			Total = totalCount,
		};

		return new GetRosterListResult(paginate, res);
	}
}
