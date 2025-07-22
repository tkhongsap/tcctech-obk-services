using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trMarcomCMSExplore")]
public class trMarcomCMSExplore : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required int Order { get; set; }

	[Required]
	public required bool IsShowRelatedLink { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? TitleRelatedEN { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? TitleRelatedTH { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? TitleRelatedCN { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? SubTitleRelatedEN { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? SubTitleRelatedTH { get; set; }

	[MaxLength(200)]
	[Column(TypeName = "character varying")]
	public string? SubTitleRelatedCN { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string TitleEn { get; set; } = default!;

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? TitleTH { get; set; }

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? TitleCN { get; set; }

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
