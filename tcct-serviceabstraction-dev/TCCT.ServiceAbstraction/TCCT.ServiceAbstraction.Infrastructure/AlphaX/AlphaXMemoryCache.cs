using Microsoft.Extensions.Caching.Memory;
using TCCT.ServiceAbstraction.Application.Contracts.AlphaX;
using TCCT.ServiceAbstraction.Application.Features.AirQuality;

namespace TCCT.ServiceAbstraction.Infrastructure.AlphaX;
public class AlphaXMemoryCache : IAlphaXMemoryCache
{
	MemoryCache _cache;
	Semaphore _semaphore;

	public AlphaXMemoryCache()
	{
		_cache = new MemoryCache(new MemoryCacheOptions());
		_semaphore = new Semaphore(2, 2);
	}

	public async Task<List<GetCalculatedResponse>> GetCalculatedResponseCache(string building, Func<string, Task<List<GetCalculatedResponse>>> func)
	{
		var key = $"alphax{building}";
		if (_cache.TryGetValue(key, out List<GetCalculatedResponse>? cacheitem)) return cacheitem!;

		try
		{
			_semaphore.WaitOne();
			if (!_cache.TryGetValue(key, out List<GetCalculatedResponse>? item)) // ไม่มีใน cache
			{
				item = await func(building);
				_cache.Set(key, item, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromSeconds(60)));
			}
			return item!;
		}
		finally
		{
			_semaphore.Release();
		}
	}

}
