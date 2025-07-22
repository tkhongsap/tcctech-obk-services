using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupportiveTeam;
public class SupportiveTeamQuery : IQuery<List<SupportiveTeamResult>>
{
	public string Id { get; set; }

	public SupportiveTeamQuery(string id)
	{
		Id = id;
	}
}
