using TCCT.ServiceAbstraction.Application.Features.AirQuality;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetActiveFloor;
using TCCT.ServiceAbstraction.Application.Features.AirQuality.GetSimpleFeedAll;

namespace TCCT.ServiceAbstraction.Application.Contracts.AlphaX;
public interface IAlphaXService
{	
	Task<GetActiveFloorResponse> GetActiveFloor(string building);
	Task<List<GetCalculatedResult>> GetCalculatedData(string building, string? floor, string? channel, string? status);
	Task<List<GetSimpleFeedAllResponse>> GetSimpleCalculatedData(string building, string? floor, string? channel, string? status);
}
