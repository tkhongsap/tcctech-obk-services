using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSubtask")]
public class trSubtask : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	public int StatusId { get; set; } = 0;
	public string? Remarks { get; set; } = default!;
	public List<trSubtaskAction> trSubtaskAction { get; set; } = new();
	public int Seq { get; set; } = 0;
}
