using TCCT.ServiceAbstraction.Application.Features.AirQuality;

namespace TCCT.ServiceAbstraction.Application.Contracts.AlphaX;
public interface IAlphaXMemoryCache
{
	Task<List<GetCalculatedResponse>> GetCalculatedResponseCache(string building, Func<string, Task<List<GetCalculatedResponse>>> func);
}
