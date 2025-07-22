using TCCTOBK.OperationBackend.Application.Contracts.DataModel.AuthRepository;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Common;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;

public interface IMemberRepository
{
	/// <summary>
	/// เรียกข้อมูลของ member ทั้งหมด
	/// </summary>
	/// <returns>list of member</returns>
	Task<List<taMember>> GetAll(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state);
	/// <summary>
	/// เรียกข้อมูลของ member ทั้งหมดเพื่อออกรีพอร์ต
	/// </summary>
	/// <returns>list of member report</returns>
	Task<List<taMember>> GetAllReport(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable);
	/// <summary>
	/// เรียกข้อมูลของ member by tenant ทั้งหมด
	/// </summary>
	/// <returns>list of member</returns>
	Task<List<taMember>> GetByTenant(Guid tenantId);
	Task<List<taMember>> GetByTenant(Guid tenantId, bool scopeClientSite);
	/// <summary>
	/// เรียกข้อมูลของ memeber ตาม ID
	/// </summary>
	/// <param name="mid">member id</param>
	/// <returns>member</returns>
	Task<taMember> GetByIdWithOutActive(Guid mid);
	Task<taMember> GetById(Guid mid);
	/// <summary>
	/// เรียกข้อมูลของ memeber ตาม KeyCloakUserId
	/// </summary>
	/// <param name="keyCloakUserId">keyCloakUserId</param>
	/// <returns>member</returns>
	Task<taMember> GetByKeyCloakUserId(string keyCloakUserId);
	/// <summary>
	/// เรียกข้อมูลของ member ตามการค้นหา
	/// </summary>
	/// <param name="filter">id,email</param>
	/// <param name="roleids">roles</param>
	/// <returns></returns>
	Task<List<taMember>> GetByFilter(string? filter = null, List<Guid>? roleids = null);
	/// <summary>
	/// สร้างข้อมูล member
	/// </summary>
	/// <param name="email">email adress</param>
	/// <param name="status">status</param>
	/// <param name="roles">roles ที่จะ assign ให้ member ที่ต้องการสร้าง</param>
	/// <returns></returns>
	Task<Guid> CreateMember(string email, int status, List<Guid> roles, AuditableModel auditable);
	Task<Guid> CreateMember(string email, int status, List<Guid> roles, string keyCloakUserId, AuditableModel auditable);
	Task<Guid> CreateMember(string email, string name, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable);
	Task<Guid> CreateMember(string email, string firstname, string lastname, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable);
	Task<Guid> CreateMember(string email, string firstname, string lastname, int status, List<Guid> roles, string keyCloakUserId, string dataJson, AuditableModel auditable, Guid? csid);

	/// <summary>
	/// update ข้อมูล member
	/// </summary>
	/// <param name="mid">member id</param>
	/// <param name="status">status</param>
	/// <param name="roles">roles ที่ต้องการ assign ให้ member</param>
	/// <returns></returns>
	Task<Guid> UpdateStatusMember(Guid mid, int status, List<Guid> roles, AuditableModel auditable);
	/// <summary>
	/// update ข้อมูล member
	/// </summary>
	/// <param name="mid">member id</param>
	/// <param name="status">status</param>
	/// <returns></returns>
	Task<Guid> UpdateStatusMember(Guid mid, int status, AuditableModel auditable);
	/// <summary>
	/// เรียกดูข้อมูล role member ทั้งหมด
	/// </summary>
	/// <returns></returns>

	Task<List<trRoleMember>> GetMemberRole();
	/// <summary>
	/// เรียกดูข้อมูล role ของ member
	/// </summary>
	/// <param name="mid">member id</param>
	/// <returns>list of roles</returns>
	Task<trRoleMember> GetMemberRole(Guid mid);
	/// <summary>
	/// เรียกข้อมูลของ member ด้วย email address
	/// </summary>
	/// <param name="email">email address</param>
	/// <returns></returns>
	Task<taMember> GetByEmail(string email);
	Task<taMember> GetByEmail(string email, bool isUseKC);
	Task<taMember> GetByEmail(string email, bool isUseKC, bool isScopeClientSite);
	Task<List<taMember>> GetMemebersByRole(Guid roleId);
	Task<Guid> UpdateMember(Guid mid, string name, int status, bool isactive, AuditableModel auditable);
	Task<Guid> UpdateMember(Guid mid, string name, int status, string userkeycloak, AuditableModel auditable);

	Task<Guid> UpdateEmailActivityMember(Guid mid, EmailActivityModel emaildata, AuditableModel auditable);
	Task<string?> GetMemberNameByKeyCloakUserId(string keyCloakUserId);
	Task<int> GetAllCount(string? filter, List<Guid> roleid, int? status, List<Guid>? tenantIds, bool isAvailable, TableState state);
	Task InsertTenantMember(Guid memberId, Guid tenentId, Guid? csid);
	Task InsertTenantMember(Guid memberId, Guid tenentId);
	Task InsertTenantMember(Guid memberId, Guid tenentId, Guid? csid, Guid updatedBy, string updatedByName);
	Task<bool> CheckTenant(Guid mid, Guid tenantId);
	Task<taMember?> UpdateFailAttempt(string email);
	Task<taMember?> ResetFailAttempt(Guid mid);
	Task<taMember?> Logout(Guid mid);

	Task UpdateDataJson(Guid id, string datajson);
	/// <summary>
	/// Unlock member failed attempt more than 3 times
	/// </summary>
	/// <param name="mid">Member Id</param>
	/// <returns></returns>
	Task<taMember?> UnlockMemberById(Guid mid);
	Task<taMember?> IsActiveById(Guid mid, Boolean isActive);
	Task<taMember> GetByEmailLower(string email);
	Task<taMember> GetByEmailLower(string email, bool isCheckIsActive);
	Task<taMember> GetByEmailLowerWithOutActive(string email);
	Task<taMember> GetByIdWithOutCatch(Guid id);
	Task<taMember> GetByIdWithOutCatchWithOutActive(Guid id);
	Task UpdateMemberStaffId(Guid? mid, int staffId);
	Task UpsertFunctionRoleLocation(Guid mid, List<CreateFunctionRolesLocationMember> funcRoleLocation);
	Task<List<ClientMember>> GetClientMembers(string kcuserid);

	Task<taMember> GetByStaffId(int staffid);
	Task<taMember> GetByStaffId(int staffid, bool isScopeClientSite);
	Task<List<taMember>> GetAll();

	Task updateByKeycloak(string id, AuditableModel resetPass);

	Task AddClientMember(Guid mid);
	Task AddClientMember(Guid mid, int staffid, string datajson);

	Task<bool> CheckClientMember(Guid mid, Guid csid);

	Task<taMember> GetByKeyCloakUserId(string keyCloakUserId, bool isCheckIsActive);

	Task StampUpdatedBy(Guid mid, Guid updatedBy, string updatedByName);

}