using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Command.Happening;

public class HappeningHandler : IRequestHandler<UpdateHappeningCommand, UpdateHappeningResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public HappeningHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<UpdateHappeningResult> Handle(UpdateHappeningCommand request, CancellationToken cancellationToken)
	{
		HappeningDataModel content = new HappeningDataModel(request.Id, request.Status, request.IsShowRelate, request.IsArtC, request.IsDelete, request.Order, request.Start, request.End, request.Alltime, request.StartEvent, request.EndEvent, request.LinkToURL, request.Type, request.Tag, request.Detail, request.IsCategory, request.Parent, request.IsPin, request.SystemType, request.ArtType);

		await _uow.MarcomRepository.UpdateHappening(content, request);
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

		return new UpdateHappeningResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
