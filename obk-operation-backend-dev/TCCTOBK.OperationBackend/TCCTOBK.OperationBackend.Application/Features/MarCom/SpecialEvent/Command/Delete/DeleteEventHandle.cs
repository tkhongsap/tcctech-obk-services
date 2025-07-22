using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Command.DeleteSpecialEvent;

public class DeleteEventHandler : IRequestHandler<DeleteEventCommand, DeleteEventResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public DeleteEventHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<DeleteEventResult> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
	{
		DeleteEvent content = new DeleteEvent(request.Id);

		await _uow.MarcomRepository.DeleteEvent(content, request);
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

		return new DeleteEventResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
