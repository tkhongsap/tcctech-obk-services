using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trMarcomCMSTag")]
public class trMarcomCMSTag : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required Guid ContentId { get; set; }

	[Required]
	public required int Order { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string TagName { get; set; } = default!;

	[Required]
	public required bool IsDelete { get; set; }
}
