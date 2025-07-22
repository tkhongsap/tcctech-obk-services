using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Netatmo;
using TCCT.ServiceAbstraction.Domain.Netatmo.Entities;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.GetListUserToken;
public class GetListUserTokenHandler : IQueryHandler<GetListUserTokenQuery, GetListUserTokenResult>
{
	private readonly INetatmoService _netatmoservice;
	public GetListUserTokenHandler(INetatmoService netatmoservice)
	{
		_netatmoservice = netatmoservice;
	}
	public async Task<GetListUserTokenResult> Handle(GetListUserTokenQuery request, CancellationToken cancellationToken)
	{
		var response = await _netatmoservice.GetUserTokenList(request.TenantId, request.HomeId);
		GetListUserTokenResult result = new GetListUserTokenResult();
		result.data = response;
		return result;
	}
}
