using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Command.Explore;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.SpecialEvent.Command.SpecialEvent;

public class ExploreHandler : IRequestHandler<UpdateExploreCommand, UpdateExploreResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public ExploreHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<UpdateExploreResult> Handle(UpdateExploreCommand request, CancellationToken cancellationToken)
	{
		ExploreDataModel content = new ExploreDataModel(request.Status, request.IsDelete, request.Order, request.Detail, request.Id, request.IsShowRelate, request.Tag);

		await _uow.MarcomRepository.UpdateExplore(content, request);
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

		return new UpdateExploreResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
