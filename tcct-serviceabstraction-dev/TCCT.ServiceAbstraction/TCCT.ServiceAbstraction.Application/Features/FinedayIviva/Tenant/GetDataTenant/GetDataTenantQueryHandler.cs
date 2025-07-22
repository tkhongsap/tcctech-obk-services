using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Tenant.GetDataTenant;

public sealed class GetDataTenantQueryHandler : IQueryHandler<GetDataTenantQuery, GetDataTenantResult>
{
	private readonly IFinedayIvivaService _service;
	public GetDataTenantQueryHandler(IFinedayIvivaService service)
	{
		_service = service;
	}

	public async Task<GetDataTenantResult> Handle(GetDataTenantQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.WithTenant().GetDataTenant(request.Search, request.StartDate, request.EndDate, request.Active);
		return res;
	}

}

