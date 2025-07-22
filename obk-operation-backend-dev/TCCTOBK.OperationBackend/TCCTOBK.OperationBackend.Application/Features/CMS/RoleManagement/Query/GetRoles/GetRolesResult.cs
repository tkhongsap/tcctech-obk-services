using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Model;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRoles;
public record GetRolesResult(int TotalRecords, List<RoleModel> Data);