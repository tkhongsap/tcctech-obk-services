using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ChangeOrder.Command.ChangeOrder;

public class ChangeOrderMarcomCommand : AuditableModel, ICommand<ChangeOrderMarcomResult>
{
	public Guid Id { get; set; }
	public int Type { get; set; }
	public int NewOrder { get; set; }
}
