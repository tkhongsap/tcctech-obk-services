using TCCT.ServiceAbstraction.Domain.LogPose;

namespace TCCT.ServiceAbstraction.Application.Features.LogPose.GetAP;
public class GetAPResult
{
	public List<APPositionModel> Items { get; set; } = new();
}
