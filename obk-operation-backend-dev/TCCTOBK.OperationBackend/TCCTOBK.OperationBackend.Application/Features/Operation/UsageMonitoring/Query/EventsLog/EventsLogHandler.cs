using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;
public class EventsLogHandler : IQueryHandler<EventsLogQuery, List<EventsLogResult>>
{
	IUnitOfWork _uow;
	private readonly IAbstractionService _abstractionService;
	public EventsLogHandler(IAbstractionService abstractionService, IUnitOfWork uow)
	{
		_uow = uow;
		_abstractionService = abstractionService;

	}
	public async Task<List<EventsLogResult>> Handle(EventsLogQuery request, CancellationToken cancellationToken)
	{

		List<EventsLogResult> res = await _abstractionService.UserService.EventsLog(request.Max ?? 0, request.Type ?? "LOGIN");

		await _uow.EventsLogRepository.CreateEventsLogFromApi(res);
		await _uow.SaveChangeAsyncWithCommit();
		return res;
	}
}
