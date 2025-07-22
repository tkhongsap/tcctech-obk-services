using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TCCTOBK.OperationBackend.Domain.Common;
public class Auditable
{
	[MaxLength(100)]
	[Column(TypeName = "character varying")]
	public Guid CreatedBy { get; set; }

	[MaxLength(100)]
	[Column(TypeName = "character varying")]
	public string CreatedByName { get; set; } = default!;

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime CreatedDate { get; set; }

	[MaxLength(100)]
	[Column(TypeName = "character varying")]
	public Guid UpdatedBy { get; set; }

	[MaxLength(100)]
	[Column(TypeName = "character varying")]
	public string UpdatedByName { get; set; } = default!;

	[MaxLength(100)]
	[Column(TypeName = "timestamp without time zone")]
	public DateTime UpdatedDate { get; set; }
}
