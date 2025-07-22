using TCCTOBK.OperationBackend.Application.Contracts.DataModel.RoleRepository;
using TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.OpsAppRoles;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IRoleRepository
{
	Task<List<trRole>> GetAll(string? filter, List<Guid>? privilege, Guid? tenantId, TableState state);
	Task<int> GetAllCount(string? filter, List<Guid>? privilege, Guid? tenantId);
	Task<trRole> GetById(Guid id);
	Task<List<trRole>> GetByFilterAndStatus(string? filter = null, bool? status = null);
	Task<List<trRole>> GetByMember(Guid mid);

	Task<List<trRole>> GetByName(string name);
	Task<Guid> CreateRole(CreateRoleModel role, AuditableModel auditable);

	Task UpdateRole(UpdateRoleModel role, AuditableModel auditable);
	Task UpdateRoleStatus(Guid rid, bool status, AuditableModel auditable);

	Task UpdateRoleMember(Guid mid, List<Guid> rid);
	Task UpdateRoleMember(Guid mid, List<Guid> rid, Guid tid);
	Task<int> ClearPrivilege(Guid rid);

	Task<int> RemoveRole(Guid roleId, AuditableModel auditable);

	Task<List<trRole>> GetRoleByRefId(List<int> refId);
}
