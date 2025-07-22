namespace TCCT.ServiceAbstraction.Application.Contracts;
public interface IRedisService
{
	Task SetCacheAsync(string key, string value, TimeSpan expiration);
	Task<string> GetCacheAsync(string key);
}
