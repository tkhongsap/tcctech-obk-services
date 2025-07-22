using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Command.PRBannerManagement;

namespace TCCTOBK.OperationBackend.Application.Features.MarcomBannerManagementManagement.Command.MarcomBannerManagement;

public class MarcomBannerManagementHandler : IRequestHandler<MarcomBannerManagementCommand, MarcomBannerManagementResult>
{
	IUnitOfWork _uow;
	IDistributedCache _cache;
	public MarcomBannerManagementHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_uow = uow;
		_cache = cache;
	}
	public async Task<MarcomBannerManagementResult> Handle(MarcomBannerManagementCommand request, CancellationToken cancellationToken)
	{
		MarcomManagementDataModel content = new MarcomManagementDataModel(request.BannerName, request.Status, request.IsShowRelatedLink, request.IsDelete, request.Order, request.Detail, request.Type, request.Id, request.LinkToURL, request.Start, request.End, request.Alltime);

		await _uow.MarcomRepository.UpdatePRBanner(content, request);
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

		return new MarcomBannerManagementResult() { StatusCode = StatusCodes.Status200OK, Message = "Success" };
	}
}
