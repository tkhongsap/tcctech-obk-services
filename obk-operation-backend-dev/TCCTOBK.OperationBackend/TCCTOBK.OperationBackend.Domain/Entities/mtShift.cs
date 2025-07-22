using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("mtShift")]
public class mtShift
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }

	[Required]
	public required TimeSpan StartTime { get; set; }

	[Required]
	public required TimeSpan EndTime { get; set; }

	[Required]
	public required TimeSpan AllowCheckInStart { get; set; }

	[Required]
	public required TimeSpan AllowCheckInEnd { get; set; }

	[Required]
	public required TimeSpan CheckoutTimeEnd { get; set; }

	[Required]
	public required int isOverNight { get; set; } // 0: not over night, 1: over night

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;

}

