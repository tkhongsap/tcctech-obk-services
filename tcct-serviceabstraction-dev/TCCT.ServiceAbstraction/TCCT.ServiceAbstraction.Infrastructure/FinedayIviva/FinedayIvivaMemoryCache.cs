using Microsoft.Extensions.Caching.Memory;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Login.Login;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;
public class FinedayIvivaMemoryCache : IFinedayIvivaMemoryCache
{
	MemoryCache _cache;
	Semaphore _semaphore;

	public FinedayIvivaMemoryCache()
	{
		_cache = new MemoryCache(new MemoryCacheOptions());
		_semaphore = new Semaphore(2, 2);
	}

	public async Task<LoginResult> GetTokenCache(Func<Task<LoginResult>> func)
	{
		var key = "fsivivatcc";
		if (_cache.TryGetValue(key, out LoginResult? cacheitem)) return cacheitem!;

		try
		{
			_semaphore.WaitOne();
			if (!_cache.TryGetValue(key, out LoginResult? item)) // ไม่มีใน cache
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
