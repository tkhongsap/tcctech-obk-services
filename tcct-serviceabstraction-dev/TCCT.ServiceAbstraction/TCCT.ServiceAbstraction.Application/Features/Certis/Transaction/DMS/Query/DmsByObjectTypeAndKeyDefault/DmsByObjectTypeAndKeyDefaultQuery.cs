using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyDefault;
public class DmsByObjectTypeAndKeyDefaultQuery : IQuery<List<DmsByObjectTypeAndKeyDefaultResult>>
{
	public string Ot { get; set; }
	public string Ok { get; set; }

	public DmsByObjectTypeAndKeyDefaultQuery(string ot, string ok)
	{
		Ot = ot;
		Ok = ok;
	}
}
