using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Nodes;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trSchedulePlan")]
public class trSchedulePlan : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }
    public Guid CSID { get; set; } = Constant.OBK_CLIENT_SITE;
	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Route { get; set; }
	public trActivityProcedure trActivityProcedure { get; set; } = default!;


	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public TimeSpan StartTime { get; set; }

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public TimeSpan EndTime { get; set; }

	[Column(TypeName = "jsonb")]
	public String Frequency { get; set; }

	[ForeignKey(nameof(taMember))]
	public Guid MID { get; set; }
	public taMember taMember { get; set; } = default!;

	public bool IsActive { get; set; } = true;
}
