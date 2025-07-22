using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Nodes;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trRoster")]
public class trRoster
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	[MaxLength(500)]
	[Column(TypeName = "character varying")]
	public required string Component { get; set; }
	public string LocationCode { get; set; } = "";
	public int? WeekDay { get; set; }
	public int? WeekEnd { get; set; }
	public bool IsActive { get; set; } = true;
	public DateTime StartDateTime { get; set; } = DateTime.Now;
	public DateTime? EndDateTime { get; set; }

	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
