using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trRole")]
public class trRole : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid RID { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	[Required]
	[MaxLength(1000)]
	[Column(TypeName = "character varying")]
	public string? Description { get; set; }

	[DefaultValue(true)]
	public bool IsActive { get; set; } = true;

	[DefaultValue(false)]
	public bool? IsDelete { get; set; } = false;

	[ForeignKey(nameof(Tenant))]
	public Guid TID { get; set; }
	public Tenant Tenant { get; set; } = default!;

	public List<trRoleMember> trRoleMembers { get; set; } = new();
	public List<trRolePrivilegeItem> trRolePrivilagesItem { get; set; } = new();
	public Guid? CSID { get; set; }
	public int RefId { get; set; }
}
