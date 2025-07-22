using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application;

public class UpdateHomeContentCommand : AuditableModel, IRequest<UpdateHomeContentResult>
{
	public string ImageURL { get; set; } = default!;
	public bool IsVisible => Visible == 1;
	public int Visible { get; set; }
	public string? Note { get; set; } = default!;
	public string Message { get; set; } = default!;
	public string FileName { get; set; } = default!;
	public string OriginalFileName { get; set; } = default!;
}
