using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtPrivilege")]
public class mtPrivilege
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid PID { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	[MaxLength(1000)]
	[Column(TypeName = "character varying")]
	public string? Description { get; set; }

	[DefaultValue(true)]
	public bool IsActive { get; set; } = true;

	public List<mtPrivilegeItem> mtPrivilegeItems { get; set; } = new();


	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
