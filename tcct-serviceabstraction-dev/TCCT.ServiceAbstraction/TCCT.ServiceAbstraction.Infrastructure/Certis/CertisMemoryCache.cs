using Microsoft.Extensions.Caching.Memory;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Infrastructure.AlphaX;
public class CertisMemoryCache : ICertisMemoryCache
{
	MemoryCache _cache;
	Semaphore _semaphore;

	public CertisMemoryCache()
	{
		_cache = new MemoryCache(new MemoryCacheOptions());
		_semaphore = new Semaphore(2, 2);
	}

	//public async Task<List<GetCalculatedResponse>> GetCalculatedResponseCache(string building, Func<string, Task<List<GetCalculatedResponse>>> func)
	//{
	//	try
	//	{
	//		_semaphore.WaitOne();
	//		if (!_cache.TryGetValue(building, out List<GetCalculatedResponse>? item)) // ไม่มีใน cache
	//		{
	//			item = await func(building);
	//			_cache.Set(building, item, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromSeconds(60)));
	//		}
	//		return item!;
	//	}
	//	finally
	//	{
	//		_semaphore.Release();
	//	}
	//}

}
