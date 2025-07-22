using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSustainabilityLibraryFile")]
public class trSustainabilityLibraryFile : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required Guid TopicId { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string Language { get; set; } = default!;

	[Required]
	public required int Order { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverImageURL { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverFileName { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverOriginalFileName { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string AttachFileURL { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string AttachFileName { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string AttachOriginalFileName { get; set; } = default!;

	[Required]
	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public required string AttachFileType { get; set; }

	[Required]
	[MaxLength(50)]
	[Column(TypeName = "character varying")]
	public required string AttachFileSize { get; set; }

	[Required]
	public required bool IsActive { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
