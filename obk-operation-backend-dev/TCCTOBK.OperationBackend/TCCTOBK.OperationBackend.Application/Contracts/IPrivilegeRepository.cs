using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Contracts;
public interface IPrivilegeRepository
{
	/// <summary>
	/// เรียกข้อมูลของ Privilege ทั้งหมด
	/// </summary>
	Task<List<mtPrivilege>> GetAll(string? name = null, Guid? ptid = null, int skip = 0, int? take = null);
	/// <summary>
	/// เรียกข้อมูลของ Privilege ตาม ID
	/// </summary>
	Task<mtPrivilege> GetById(Guid id);
	/// <summary>
	/// สร้างข้อมูล Privilege ข้อมูล ของ PrivilegeItem ต้องเกิดมาพร้อมกันเสมอ
	/// </summary>
	Task<mtPrivilege> CreatePrivilege(mtPrivilege privilege, List<mtPrivilegeItem> privilegeitem);
	/// <summary>
	/// สร้างข้อมูล Privileges ข้อมูล ของ PrivilegeItem ต้องเกิดมาพร้อมกันเสมอ
	/// </summary>
	Task CreatePrivileges(List<mtPrivilege> privileges);
	/// <summary>
	/// อัพเดทข้อมูล Privilege
	/// </summary>
	Task UpdatePrivilegeItem(Guid rid, List<Guid> privilegeitem);

	/// <summary>
	/// อัพเดทข้อมูล Status Active,InActive
	/// </summary>
	Task UpdatePrivilegeItem(Guid rid, List<Guid> privilegeitem, bool isactive);

	Task<mtPrivilegeItem> GetByCode(string code);
	Task<mtPrivilegeItem> GetPrivilegeItemById(Guid ptid);
}
