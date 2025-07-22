using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Domain;

[Table("trFunctionRoleLocationSOC")]
public class trFunctionRoleLocationSOC
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid FRLID { get; set; }
	public int LocationId { get; set; } = default!;

	public int FunctionRoleId { get; set; } = default!;


	[ForeignKey(nameof(SOCUser))]
	public Guid SID { get; set; }

	public SOCUser SOCUser { get; set; } = default!;

}
