using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSustainabilityCMS")]
public class trSustainabilityCMS : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required bool IsSubMenu { get; set; }
	public Guid? ParentId { get; set; }

	public bool? IsShowRelatedLink { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? TitleRelatedEN { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? TitleRelatedTH { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? TitleRelatedCN { get; set; }

	[Required]
	public required int Order { get; set; }

	public int? LayoutType { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string MenuNameEn { get; set; } = default!;

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? MenuNameTH { get; set; }

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? MenuNameCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverImageURLEN { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverFileNameEN { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverOriginalFileNameEN { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverImageURLTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverFileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverOriginalFileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverImageURLCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverFileNameCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? CoverOriginalFileNameCN { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IntroduceEN { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IntroduceTH { get; set; }

	[MaxLength(2000)]
	[Column(TypeName = "character varying")]
	public string? IntroduceCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadImageURLEN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadFileNameEN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadOriginalFileNameEN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadImageURLTH { get; set; }
	[Column(TypeName = "character varying")]
	public string? HeadFileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadOriginalFileNameTH { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadImageURLCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadFileNameCN { get; set; }

	[Column(TypeName = "character varying")]
	public string? HeadOriginalFileNameCN { get; set; }

	[Required]
	public required bool IsActive { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
