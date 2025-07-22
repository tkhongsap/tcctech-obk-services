using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Command.ServiceRequest.Upsert;

public class EventCommand : AuditableModel, IRequest<mtSREvent>
{
    public string Name_th { get; set; }
    public string Name_en { get; set; }

}
