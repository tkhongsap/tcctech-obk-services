using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Urgent.Query.ServiceRequest.GetServiceRequest;

public class GetServiceRequestResult : trServiceRequest
{
    public List<mtSREvent>? Event { get; set; }
    public List<mtSRProblem>? Problem { get; set; }
}