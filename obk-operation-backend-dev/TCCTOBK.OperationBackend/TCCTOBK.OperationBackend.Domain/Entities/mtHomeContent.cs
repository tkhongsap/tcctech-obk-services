using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
public class mtHomeContent : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid HCID { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required int Version { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public string ImageURL { get; set; } = default!;

	public bool IsVisible { get; set; }

	public string? Note { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public string RemoteConfigDataJson { get; set; } = default!;

	public string RemoteConfigResponseDataJson { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public string OriginalFileName { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public string FileName { get; set; } = default!;
}
