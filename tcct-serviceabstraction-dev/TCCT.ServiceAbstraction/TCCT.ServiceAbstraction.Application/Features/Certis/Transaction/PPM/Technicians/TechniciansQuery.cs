using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Technicians;
public class TechniciansQuery : IQuery<List<TechniciansResult>>
{
	public string Id { get; set; }
	public TechniciansQuery(string id)
	{
		Id = id;
	}
}
