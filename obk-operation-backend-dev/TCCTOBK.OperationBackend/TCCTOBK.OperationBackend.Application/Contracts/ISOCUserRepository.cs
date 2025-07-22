using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSocMember;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application;

public interface ISOCUserRepository
{
	Task<SOCUser> GetByKeyCloakUserId(string kcusername);
	Task<bool> CheckTenant(Guid sid, Guid tenantId);
	Task<Guid> CreateSOCUser(string email, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable, string identifynumber, int identifytype, string firstname, string lastname);
	Task InsertTenantSOCUser(Guid memberId, Guid tenentId);
	Task<List<SOCUser>> GetAll();
	Task<List<SOCUser>> GetAll(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state);
	Task<int> GetAllCount(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state);

	Task<SOCUser> GetById(Guid mid);
	Task UpdateRole(Guid sid, List<Guid> rid);

	Task UpdateDataJson(Guid mid, string datajson);
	Task UpdateSOCStaffId(Guid? sid, int? staffId);
	Task<SocUser> GetByEmail(string email);

	Task UpdateSOC(SOCUser data, AuditableModel auditable);

	Task<SocUser> GetByEmailLower(string email);
	Task<SocUser> GetByEmailLowerWithOutError(string email);
	Task UpsertFunctionRoleLocation(Guid sid, List<CreateFunctionRolesLocationSOC> funcRoleLocation);
	Task<SOCUser> GetByIdWithOutCatch(Guid guid);
	Task<SOCUser> GetByStaffId(int staffid);

}
