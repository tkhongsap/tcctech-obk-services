using Microsoft.AspNetCore.Http;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.CreateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffByBuilding;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.AddStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetFunctionRoles;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.DeleteStaffRoleMapping;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Command.UpdateStaff;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.Core.Query.GetStaffSearch;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
public interface ICertisTransactionCoreService
{
	Task<CreateStaffResult> CreateStaff(CreateStaffCommand data);
	Task<List<GetStaffByBuildingResult>> GetStaffByBuilding(GetStaffByBuildingQuery data);
	Task<List<GetStaffRoleMappingResult>> GetStaffRoleMapping(GetStaffRoleMappingQuery data);
	Task<AddStaffRoleMappingResult> AddStaffRoleMapping(AddStaffRoleMappingCommand data);
	Task<UpdateStaffResult> UpdateStaff(UpdateStaffCommand data);
	Task<DeleteStaffRoleMappingResult> DeleteStaffRoleMapping(DeleteStaffRoleMappingCommand data);
	Task<List<GetFunctionRolesResult>> GetFunctionRoles(GetFunctionRolesQuery data);
	Task<List<GetStaffSearchResult>> GetStaffSearch(GetStaffSearchQuery data);
}
