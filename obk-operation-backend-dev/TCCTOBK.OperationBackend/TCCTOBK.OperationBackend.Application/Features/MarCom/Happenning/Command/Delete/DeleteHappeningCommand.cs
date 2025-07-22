using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Command.DeleteHappening;

public class DeleteHappeningCommand : AuditableModel, ICommand<DeleteHappeningResult>
{
	public Guid? Id { get; set; }
	public bool? IsCategory { get; set; }
}
