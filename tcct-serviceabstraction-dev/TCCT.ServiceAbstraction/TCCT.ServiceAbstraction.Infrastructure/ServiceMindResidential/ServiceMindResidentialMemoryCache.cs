using Microsoft.Extensions.Caching.Memory;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.Netatmo;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.AuthorizeTenant;

namespace TCCT.ServiceAbstraction.Infrastructure.ServiceMindResidential;
public class ServiceMindResidentialMemoryCache : IServiceMindResidentialMemoryCache
{
	MemoryCache _cache;
	Semaphore _semaphore;

	public ServiceMindResidentialMemoryCache()
	{
		_cache = new MemoryCache(new MemoryCacheOptions());
		_semaphore = new Semaphore(2, 2);
	}

	public async Task<AuthorizeTenantResult> GetTokenCache(Func<string?, Task<AuthorizeTenantResult>> func, string? parameter)
	{
		var cacheKey = $"smsccresidential{parameter}";
		if (_cache.TryGetValue(cacheKey, out AuthorizeTenantResult? cacheitem)) return cacheitem!;

		try
		{
			_semaphore.WaitOne();			
			if (!_cache.TryGetValue(cacheKey, out AuthorizeTenantResult? item)) // ไม่มีใน cache
			{
				item = await func(parameter);
				_cache.Set(cacheKey, item, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(600 - 10)));
			}
			return item!;
		}
		finally
		{
			_semaphore.Release();
		}
	}

}
