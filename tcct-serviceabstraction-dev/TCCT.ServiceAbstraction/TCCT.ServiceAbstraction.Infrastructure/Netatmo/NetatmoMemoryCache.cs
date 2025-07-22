using Microsoft.Extensions.Caching.Memory;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Application.Features.Netatmo;

namespace TCCT.ServiceAbstraction.Infrastructure.Netatmo;
public class NetatmoMemoryCache : INetatmoMemoryCache
{
	MemoryCache _cache;
	Semaphore _semaphore;
	public NetatmoMemoryCache()
	{
		_cache = new MemoryCache(new MemoryCacheOptions());
		_semaphore = new Semaphore(2, 2);
	}

	public async Task<NetatmoResponse> GetTokenCache(Func<Task<NetatmoResponse>> func)
	{
		var key = "ntrefreshtoken";
		if (_cache.TryGetValue(key, out NetatmoResponse? cacheitem)) return cacheitem!;

		try
		{
			_semaphore.WaitOne();
			if (!_cache.TryGetValue(key, out NetatmoResponse? item)) // ไม่มีใน cache
			{
				item = await func();
				_cache.Set(key, item, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(1440 - 10)));
			}
			return item!;
		}
		finally
		{
			_semaphore.Release();
		}
	}

}
