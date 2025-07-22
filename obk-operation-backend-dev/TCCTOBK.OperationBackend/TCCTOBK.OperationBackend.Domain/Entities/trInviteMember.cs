using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trInviteMember")]
public class trInviteMember : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid IMID { get; set; }

	[ForeignKey(nameof(taMember))]
	public Guid MID { get; set; }

	public taMember taMember { get; set; } = default!;

	[Required]
	[MaxLength(250)]
	[Column(TypeName = "character varying")]
	public required string InviteCode { get; set; }

	[DefaultValue(true)]
	public bool IsActive { get; set; }

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
