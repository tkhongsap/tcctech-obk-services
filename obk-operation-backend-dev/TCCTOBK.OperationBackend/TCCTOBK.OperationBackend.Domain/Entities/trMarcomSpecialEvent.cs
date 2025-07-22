using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trMarcomSpecialEvent")]
public class trMarcomSpecialEvent : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required int Order { get; set; }

	[Required]
	[Column(TypeName = "timestamp without time zone")]
	public required DateTime ShowTimeStartDate { get; set; }

	[Column(TypeName = "timestamp without time zone")]
	public DateTime? ShowTimeEndDate { get; set; }

	[Required]
	public required bool IsNotSpecify { get; set; }

	[Required]
	public required bool IsShowDontShowAgain { get; set; }

	[Required]
	[Column(TypeName = "character varying")]
	public required string EventName { get; set; }

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
	public required bool IsActive { get; set; }

	[Required]
	public required bool IsDelete { get; set; }
}
