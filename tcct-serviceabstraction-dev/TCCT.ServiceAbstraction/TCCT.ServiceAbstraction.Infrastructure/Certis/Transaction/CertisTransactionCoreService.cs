using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.CreateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffByBuilding;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.AddStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetFunctionRoles;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.DeleteStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.UpdateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffSearch;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.Transaction;
public class CertisTransactionCoreService : ICertisTransactionCoreService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisTransactionCoreService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public Task<CreateStaffResult> CreateStaff(CreateStaffCommand data)
	{
		return _endpointprovider.CreateStaff(data);
	}

	public Task<List<GetStaffByBuildingResult>> GetStaffByBuilding(GetStaffByBuildingQuery data)
	{
		return _endpointprovider.GetStaffByBuilding(data);
	}

	public Task<List<GetStaffRoleMappingResult>> GetStaffRoleMapping(GetStaffRoleMappingQuery data)
	{
		return _endpointprovider.GetStaffRoleMapping(data);
	}

	public Task<AddStaffRoleMappingResult> AddStaffRoleMapping(AddStaffRoleMappingCommand data)
	{
		return _endpointprovider.AddStaffRoleMapping(data);
	}

	public async Task<UpdateStaffResult> UpdateStaff(UpdateStaffCommand data)
	{
		return await _endpointprovider.UpdateStaff(data);
	}
	public async Task<DeleteStaffRoleMappingResult> DeleteStaffRoleMapping(DeleteStaffRoleMappingCommand data)
	{
		return await _endpointprovider.DeleteStaffRoleMapping(data);
	}
	public async Task<List<GetFunctionRolesResult>> GetFunctionRoles(GetFunctionRolesQuery data)
	{
		return await _endpointprovider.GetFunctionRoles(data);
	}
	public async Task<List<GetStaffSearchResult>> GetStaffSearch(GetStaffSearchQuery data)
	{
		return await _endpointprovider.GetStaffSearch(data);
	}
}
