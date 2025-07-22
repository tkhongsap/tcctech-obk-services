using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trTaskSubtask")]
public class trTaskSubtask : Auditable
{
	[ForeignKey(nameof(trTask))]
	public Guid Task { get; set; }
	public trTask trTask { get; set; } = default!;

	[ForeignKey(nameof(trSubtask))]
	public Guid Subtask { get; set; }
	public trSubtask trSubtask { get; set; } = default!;
	public int Seq { get; set; } = 0;
}
