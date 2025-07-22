using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtShiftManPowerRequest")]
public class mtShiftManPowerRequest : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Shift { get; set; }

	
	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string BaseLocation { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Company { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Role { get; set; }

	public int Demand { get; set; }

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime? StartDateTime { get; set; }

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime? EndDateTime { get; set; }

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}

