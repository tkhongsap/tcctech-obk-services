using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest.GetServiceRequest;
public class GetServiceRequestQuery : IQuery<GetServiceRequestResult>
{
    public Guid Id { get; set; }
    
    public GetServiceRequestQuery(Guid id)
    {
        Id = id;
    }
}