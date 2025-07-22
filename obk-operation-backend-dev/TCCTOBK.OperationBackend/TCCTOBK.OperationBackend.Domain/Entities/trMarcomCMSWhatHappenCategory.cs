using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trMarcomCMSWhatHappenCategory")]
public class trMarcomCMSWhatHappenCategory : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required int Order { get; set; }

	[Required]
	public required bool IsArtAndCulture { get; set; }

	[Required]
	public required int SystemType { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string CategoryNameEn { get; set; } = default!;

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? CategoryNameTH { get; set; }

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? CategoryNameCN { get; set; }


	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IntroduceEN { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IntroduceTH { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IntroduceCN { get; set; }

	[Required]
	public required bool IsActive { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
