using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class RejectSupervisorPPMCommand : IRequest<RejectSupervisorPPMResult>
{
  public int workOrderId { get; set; }
  public Guid rejectedBy { get; set; }
}
