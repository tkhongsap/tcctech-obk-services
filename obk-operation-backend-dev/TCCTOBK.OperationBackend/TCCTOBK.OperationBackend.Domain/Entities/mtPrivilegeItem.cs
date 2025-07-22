using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtPrivilegeItem")]
public class mtPrivilegeItem
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid PTID { get; set; }

	[ForeignKey(nameof(mtPrivilege))]
	public Guid PID { get; set; }

	public mtPrivilege mtPrivilege { get; set; } = default!;

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	[MaxLength(1000)]
	[Column(TypeName = "character varying")]
	public string? Description { get; set; }

	[Required]
	[MaxLength(1000)]
	[Column(TypeName = "character varying")]
	public string Code { get; set; } = default!;

	[DefaultValue(true)]
	public bool IsActive { get; set; } = true;
}