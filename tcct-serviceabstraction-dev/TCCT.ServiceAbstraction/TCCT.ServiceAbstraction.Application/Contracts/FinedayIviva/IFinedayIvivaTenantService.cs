using TCCT.ServiceAbstraction.Application.Features.FinedayIviva.Tenant.GetDataTenant;

namespace TCCT.ServiceAbstraction.Application.Contracts.FinedayIviva;
public interface IFinedayIvivaTenantService
{
	Task<GetDataTenantResult> GetDataTenant(string? search, string? startdate, string? enddate, bool active);
}
