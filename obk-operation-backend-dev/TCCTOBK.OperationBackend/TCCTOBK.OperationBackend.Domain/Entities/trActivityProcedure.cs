using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trActivityProcedure")]
public class trActivityProcedure : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }
	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Code { get; set; }
    public Guid CSID { get; set; } = Constant.OBK_CLIENT_SITE;
    public List<trSchedulePlan> trSchedulePlans { get; set; } = new();
	public required string TaskName { get; set; }
	public required string SubtaskActions { get; set; }
	[ForeignKey(nameof(Location))]
	public Guid LocationId { get; set; }
	public Location location { get; set; } = default!;
}
