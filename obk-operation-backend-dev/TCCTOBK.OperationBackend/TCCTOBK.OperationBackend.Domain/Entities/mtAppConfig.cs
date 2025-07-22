using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtAppConfig")]
public class mtAppConfig
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	[Required]
	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public required string Value { get; set; }

	[Required]
	[DefaultValue(true)]
	public bool IsActive { get; set; }


	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
