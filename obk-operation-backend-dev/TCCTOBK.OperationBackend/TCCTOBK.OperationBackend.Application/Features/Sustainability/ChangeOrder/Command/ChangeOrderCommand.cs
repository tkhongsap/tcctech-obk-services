using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ChangeOrder.Command.ChangeOrder;

public class ChangeOrderCommand : AuditableModel, ICommand<ChangeOrderResult>
{
	public Guid Id { get; set; }
	public int Type { get; set; }
	public int NewOrder { get; set; }
}
