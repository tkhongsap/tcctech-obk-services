using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trRolePrivilegeItem")]
public class trRolePrivilegeItem
{
	[ForeignKey(nameof(trRole))]
	public Guid RID { get; set; }
	public trRole trRole { get; set; } = default!;

	[ForeignKey(nameof(mtPrivilegeItem))]
	public Guid PTID { get; set; }
	public mtPrivilegeItem mtPrivilegeItem { get; set; } = default!;

	public bool IsActive { get; set; }
}
