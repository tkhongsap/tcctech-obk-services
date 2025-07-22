using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Text.Json.Nodes;
using TCCTOBK.OperationBackend.Domain.Common;

namespace TCCTOBK.OperationBackend.Domain.Entities;

[Table("trSubtaskAction")]
public class trSubtaskAction : Auditable
{
	[ForeignKey(nameof(trSubtask))]
	public Guid Subtask { get; set; }
	public trSubtask trSubtask { get; set; } = default!;

	[ForeignKey(nameof(trAction))]
	public Guid Action { get; set; }
	public trAction trAction { get; set; } = default!;
	public int StatusId { get; set; } = 0;
	public string? Remarks { get; set; } = default!;
	public string? Reading { get; set; } = default!;
	[Column(TypeName = "json")]
	public String? MetaData { get; set; } = default!;
	public int Seq { get; set; } = 0;
}
