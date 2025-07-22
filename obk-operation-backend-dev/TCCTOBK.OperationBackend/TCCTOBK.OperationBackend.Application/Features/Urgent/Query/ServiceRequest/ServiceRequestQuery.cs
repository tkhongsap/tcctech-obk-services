using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest;
public class ServiceRequestQuery : TableState, IQuery<ServiceRequestResult>

{
    public string? Status { get; set; }
}
