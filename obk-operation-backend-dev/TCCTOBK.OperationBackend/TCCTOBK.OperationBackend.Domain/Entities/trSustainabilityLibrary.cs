using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSustainabilityLibrary")]
public class trSustainabilityLibrary : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required int Order { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string TopicEN { get; set; } = default!;

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? TopicTH { get; set; }

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? TopicCN { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string IntroduceEN { get; set; } = default!;

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? IntroduceTH { get; set; }

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? IntroduceCN { get; set; }

	[Required]
	public required bool IsActive { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
