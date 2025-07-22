using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSustainabilityCMSContent")]
public class trSustainabilityCMSContent : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required Guid MenuId { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string Language { get; set; } = default!;

	[Required]
	public required int ContentType { get; set; }

	[Required]
	public required int Order { get; set; }

	[Column(TypeName = "character varying")]
	public string? Text { get; set; }

	[Column(TypeName = "character varying")]
	public string? ImageURL { get; set; }

	[Column(TypeName = "character varying")]
	public string? FileName { get; set; }

	[Column(TypeName = "character varying")]
	public string? OriginalFileName { get; set; }

	[Column(TypeName = "character varying")]
	public string? YoutubeURL { get; set; }

	[Required]
	public required bool IsActive { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
