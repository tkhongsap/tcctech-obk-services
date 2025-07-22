using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.IFM.CWOsbyincidentId;
public class CWOsbyincidentIdQuery : IQuery<List<CWOsbyincidentIdResult>>
{
	public int Id { get; set; }

	public CWOsbyincidentIdQuery(int id)
	{
		Id = id;
	}
}
