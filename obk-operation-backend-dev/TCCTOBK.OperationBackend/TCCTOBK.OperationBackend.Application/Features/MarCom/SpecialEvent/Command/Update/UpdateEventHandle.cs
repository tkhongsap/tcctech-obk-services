using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Command.SpecialEvent;

public class EventHandler : IRequestHandler<UpdateEventCommand, UpdateEventResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public EventHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<UpdateEventResult> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
	{
		EventDataModel content = new EventDataModel(request.EventName, request.Status, request.IsDelete, request.Order, request.Detail, request.Id, request.Start, request.End, request.Alltime, request.IsDontShowAgain);

		await _uow.MarcomRepository.UpdateEvent(content, request);
		await _uow.SaveChangeAsyncWithCommit();

		_cache.Remove("MarcomGetAllPRBanner");
		_cache.Remove("MarcomGetAllWhatHappenCategory");
		_cache.Remove("MarcomGetAllWhatHappenSub");
		_cache.Remove("MarcomGetAllWhatHappenContent");
		_cache.Remove("MarcomGetAllExplore");
		_cache.Remove("MarcomGetAllExploreContent");
		_cache.Remove("MarcomGetAllTag");
		_cache.Remove("MarcomSpecialEvent");
		_cache.Remove("MarcomBanner");
		_cache.Remove("MarcomWhatHappening");
		_cache.Remove("MarcomExplore");
		_cache.Remove("MarcomWhanHappeningCategory");
		_cache.Remove("MarcomWhatHappeningAll");

		return new UpdateEventResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
