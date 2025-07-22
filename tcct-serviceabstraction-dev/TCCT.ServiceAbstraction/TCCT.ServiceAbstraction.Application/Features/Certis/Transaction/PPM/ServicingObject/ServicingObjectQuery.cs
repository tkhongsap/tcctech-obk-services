using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ServicingObject;
public class ServicingObjectQuery : IQuery<List<ServicingObjectResult>>
{
	public string WoIdsCsv { get; set; } = null!;

	public ServicingObjectQuery(string woIdsCsv)
	{
		WoIdsCsv = woIdsCsv;
	}
}
