using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Domain.LogPose;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.GetAPDistance;

public class GetAPDistanceQuery : IQuery<GetAPDistanceResult>
{
	public List<WifiScanModel> Items { get; set; }

	public GetAPDistanceQuery(List<WifiScanModel> items)
	{
		Items = items;
	}
}
