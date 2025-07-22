using Microsoft.Extensions.Caching.Distributed;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Query.ClearCache;
public class ClearCacheHandler : IQueryHandler<ClearCacheQuery, ResultApi>
{
	IDistributedCache _cache;
	public ClearCacheHandler(IUnitOfWork uow, IDistributedCache cache)
	{
		_cache = cache;
	}

	public async Task<ResultApi> Handle(ClearCacheQuery request, CancellationToken cancellationToken)
	{
		ResultApi result = new ResultApi();
		_cache.Remove("MarcomConfig");
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

		return result;
	}
}
