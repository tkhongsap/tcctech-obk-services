using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Command.DeleteHappening;

public class DeleteHappeningHandler : IRequestHandler<DeleteHappeningCommand, DeleteHappeningResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public DeleteHappeningHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<DeleteHappeningResult> Handle(DeleteHappeningCommand request, CancellationToken cancellationToken)
	{
		DeleteExplore content = new DeleteExplore(request.Id, request.IsCategory);

		await _uow.MarcomRepository.DeleteHappening(content, request);
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

		return new DeleteHappeningResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
