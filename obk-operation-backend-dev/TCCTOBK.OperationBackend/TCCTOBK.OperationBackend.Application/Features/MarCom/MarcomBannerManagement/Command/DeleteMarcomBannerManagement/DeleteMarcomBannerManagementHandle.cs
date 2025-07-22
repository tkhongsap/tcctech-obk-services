using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.DeletePRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.MarcomBannerManagementManagement.Command.MarcomBannerManagement;

public class DeleteMarcomBannerManagementHandler : IRequestHandler<DeleteMarcomBannerManagementCommand, DeleteMarcomBannerManagementResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public DeleteMarcomBannerManagementHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<DeleteMarcomBannerManagementResult> Handle(DeleteMarcomBannerManagementCommand request, CancellationToken cancellationToken)
	{
		DeleteBannerMarcom content = new DeleteBannerMarcom(request.Id);

		await _uow.MarcomRepository.DeletePRBanner(content, request);
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

		return new DeleteMarcomBannerManagementResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
