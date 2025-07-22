using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trResetPassword")]
public class trResetPassword : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid RPID { get; set; }
	[ForeignKey(nameof(taMember))]
	public Guid MID { get; set; }

	public taMember taMember { get; set; } = default!;

	[Required]
	[MaxLength(250)]
	[Column(TypeName = "character varying")]
	public required string ResetPasswordCode { get; set; }

	[DefaultValue(true)]
	public bool IsActive { get; set; }
}
