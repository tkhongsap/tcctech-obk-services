using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKey;
public class DmsByObjectTypeAndKeyQuery : IQuery<List<DmsByObjectTypeAndKeyResult>>
{
	public string Ot { get; set; }
	public string Ok { get; set; }

	public DmsByObjectTypeAndKeyQuery(string ot, string ok)
	{
		Ot = ot;
		Ok = ok;
	}
}
