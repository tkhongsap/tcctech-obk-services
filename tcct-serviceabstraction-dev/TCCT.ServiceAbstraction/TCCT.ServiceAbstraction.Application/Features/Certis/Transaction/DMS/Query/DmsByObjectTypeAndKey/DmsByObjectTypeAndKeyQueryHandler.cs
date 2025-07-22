using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKey;
public class DmsByObjectTypeAndKeyQueryHandler : IQueryHandler<DmsByObjectTypeAndKeyQuery, List<DmsByObjectTypeAndKeyResult>>
{
	public Task<List<DmsByObjectTypeAndKeyResult>> Handle(DmsByObjectTypeAndKeyQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
