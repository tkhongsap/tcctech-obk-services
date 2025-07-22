using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActivityProcedureByTask;

public class CreateActivityProcedureByTaskCommand : AuditableModel, IRequest<CreateActivityProcedureByTaskResult>
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public Guid ActivityProcedureId { get; set; }
    public Guid Mid { get; set; }

}
