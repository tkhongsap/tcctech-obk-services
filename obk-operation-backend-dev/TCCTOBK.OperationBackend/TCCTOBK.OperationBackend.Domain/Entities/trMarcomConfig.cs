using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;
[Table("trMarcomConfig")]
public class trMarcomConfig : Auditable
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid Id { get; set; }

	[Required]
	public required int Type { get; set; }
	public int? ValueInt { get; set; }

	[MaxLength(250)]
	[Column(TypeName = "character varying")]
	public string? ValueString { get; set; }
}
