using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyHidden;
public class DmsByObjectTypeAndKeyHiddenQuery : IQuery<List<DmsByObjectTypeAndKeyHiddenResult>>
{
	public string ObjectType { get; set; }
	public int ObjectKey { get; set; }

	public DmsByObjectTypeAndKeyHiddenQuery(string objectType, int objectKey)
	{
		ObjectType = objectType;
		ObjectKey = objectKey;
	}
}
