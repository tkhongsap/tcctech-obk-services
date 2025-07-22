using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeHidden;
public class DmsByObjectTypeHiddenQuery : IQuery<List<DmsByObjectTypeHiddenResult>>
{
	public string ObjectType { get; set; }

	public DmsByObjectTypeHiddenQuery(string objectType)
	{
		ObjectType = objectType;
	}
}
