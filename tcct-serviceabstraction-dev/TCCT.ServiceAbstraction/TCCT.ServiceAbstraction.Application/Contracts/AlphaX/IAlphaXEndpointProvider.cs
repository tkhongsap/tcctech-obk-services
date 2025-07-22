using TCCT.ServiceAbstraction.Application.Features.AirQuality;

namespace TCCT.ServiceAbstraction.Application.Contracts.AlphaX;
public interface IAlphaXEndpointProvider
{
	Task<List<GetCalculatedResponse>> GetCalculatedData(string building);
}
