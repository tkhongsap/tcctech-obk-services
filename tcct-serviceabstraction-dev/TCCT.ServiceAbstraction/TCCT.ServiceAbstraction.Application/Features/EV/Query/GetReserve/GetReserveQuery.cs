using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetReserve;
public class GetReserveQuery : IQuery<GetReserveResult>
{
	public required string uuid { get; set; }
	public required string token { get; set; }
}
