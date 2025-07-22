using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trTask")]
public class trTask : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	public Guid MemberId { get; set; }

	public int StatusId { get; set; } = 0;

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime? StartDate { get; set; }

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime? EndDate { get; set; }

	[ForeignKey(nameof(Location))]
	public Guid LocationId { get; set; }
	public Location location { get; set; } = default!;

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime? CompleteDate { get; set; }
	public bool? IsLate { get; set; }
	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime? AcknowledgeDate { get; set; }
	public List<trTaskSubtask> trTaskSubtask { get; set; } = new();

	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public string? CancelReason { get; set; }
	public string? Remarks { get; set; }


	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
