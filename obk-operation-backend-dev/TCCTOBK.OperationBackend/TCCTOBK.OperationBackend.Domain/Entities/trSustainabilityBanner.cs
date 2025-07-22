using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSustainabilityBanner")]
public class trSustainabilityBanner : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required int Type { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string ImageURL { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string FileName { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string OriginalFileName { get; set; } = default!;

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelLevel1 { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelLevel2 { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelIntroduce { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelLevel1TH { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelLevel2TH { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelIntroduceTH { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelLevel1CN { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelLevel2CN { get; set; }

	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public string? LabelIntroduceCN { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
