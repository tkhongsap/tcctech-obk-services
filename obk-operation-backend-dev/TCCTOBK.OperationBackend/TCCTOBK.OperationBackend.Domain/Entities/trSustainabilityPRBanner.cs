using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSustainabilityPRBanner")]
public class trSustainabilityPRBanner : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required int Order { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string BannerName { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string ImageURLEN { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string FileNameEN { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string OriginalFileNameEN { get; set; } = default!;

	[Column(TypeName = "character varying")]
	public string? ImageURLTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? FileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? OriginalFileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? ImageURLCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? FileNameCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? OriginalFileNameCN { get; set; }

	[Required]
	public required int Type { get; set; }

	[Column(TypeName = "character varying")]
	public string? LinkToURL { get; set; }

	[Column(TypeName = "character varying")]
	public string? TextEN { get; set; }
	[Column(TypeName = "character varying")]
	public string? TextTH { get; set; }
	[Column(TypeName = "character varying")]
	public string? TextCN { get; set; }
	public bool? IsShowRelatedLink { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string HeaderImageURLEN { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string HeaderFileNameEN { get; set; } = default!;

	[Required]
	[Column(TypeName = "character varying")]
	public required string HeaderOriginalFileNameEN { get; set; } = default!;

	[Column(TypeName = "character varying")]
	public string? HeaderImageURLTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeaderFileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeaderOriginalFileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeaderImageURLCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeaderFileNameCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeaderOriginalFileNameCN { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string TitleEN { get; set; } = default!;
	[Column(TypeName = "character varying")]
	public string? TitleTH { get; set; }
	[Column(TypeName = "character varying")]
	public string? TitleCN { get; set; }

	[Required]
	public required bool IsActive { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
