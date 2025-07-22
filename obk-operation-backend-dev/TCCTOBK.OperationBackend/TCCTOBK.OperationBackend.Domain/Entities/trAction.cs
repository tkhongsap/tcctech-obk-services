using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Nodes;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trAction")]
public class trAction : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	[Required]
	[MaxLength(1000)]
	[Column(TypeName = "character varying")]
	public string? Description { get; set; }

	[ForeignKey(nameof(mtActionType))]
	public Guid ActionType { get; set; }
	public mtActionType mtActionType { get; set; } = default!;


	[Column(TypeName = "json")]
	public String? MetaData { get; set; }
	public int IsRequired { get; set; } = 0;

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
