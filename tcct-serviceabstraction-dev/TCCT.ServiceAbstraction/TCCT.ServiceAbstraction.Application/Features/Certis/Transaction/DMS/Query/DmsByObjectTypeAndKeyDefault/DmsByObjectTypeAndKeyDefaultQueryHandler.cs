using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyDefault;
public class DmsByObjectTypeAndKeyDefaulHandler : IQueryHandler<DmsByObjectTypeAndKeyDefaultQuery, List<DmsByObjectTypeAndKeyDefaultResult>>
{
	public Task<List<DmsByObjectTypeAndKeyDefaultResult>> Handle(DmsByObjectTypeAndKeyDefaultQuery request, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}
}
