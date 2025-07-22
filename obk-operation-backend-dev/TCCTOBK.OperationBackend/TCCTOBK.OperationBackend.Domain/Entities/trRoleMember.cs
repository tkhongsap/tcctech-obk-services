using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trRoleMember")]
public class trRoleMember
{
	[ForeignKey(nameof(trRole))]
	public Guid RID { get; set; }

	public trRole trRole { get; set; } = default!;

	[ForeignKey(nameof(taMember))]
	public Guid MID { get; set; }

	public taMember taMember { get; set; } = default!;

	public bool IsActive { get; set; }
}
