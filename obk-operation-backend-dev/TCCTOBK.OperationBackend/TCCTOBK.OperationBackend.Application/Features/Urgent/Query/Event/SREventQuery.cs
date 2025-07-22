using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.Event;
public class SREventQuery  : TableState, IQuery<List<mtSREvent>>

{
    public Guid? Id { get; set; }
    public string? Name { get; set; }
}
