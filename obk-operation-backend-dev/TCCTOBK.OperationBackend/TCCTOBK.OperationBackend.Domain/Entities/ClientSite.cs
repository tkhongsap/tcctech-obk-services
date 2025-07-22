using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.VisualBasic;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("ClientSite")]
public class ClientSite
{
	[Key]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public Guid CSID { get; set; }

	[Required]
	[MaxLength(255)]
	[Column(TypeName = "character varying")]
	public required string Name { get; set; }
}

