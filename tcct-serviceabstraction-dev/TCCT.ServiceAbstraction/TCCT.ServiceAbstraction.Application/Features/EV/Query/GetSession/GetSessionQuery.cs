using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Query.GetSession;
public class GetSessionQuery : IQuery<GetSessionResult>
{
	public string uuid { get; set; }
	public required string token { get; set; }
}
