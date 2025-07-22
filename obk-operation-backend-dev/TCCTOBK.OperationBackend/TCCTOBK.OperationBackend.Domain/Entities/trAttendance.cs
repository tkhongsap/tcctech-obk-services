using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trAttendance")]
public class trAttendance
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Shift { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string UserId { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Firstname { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Lastname { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Company { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Role { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string BaseLocation { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string DeviceKey { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string DeviceName { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string IndentifyType { get; set; }

	[Required]
	public required string IdentifyDate { get; set; }

	public DateTime? CheckInDateTime { get; set; }

	public DateTime? CheckOutDateTime { get; set; }

	[Column(TypeName = "json")]
	public String? MetaData { get; set; } = default!;
	public int LateTime { get; set; } = 0;


	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
