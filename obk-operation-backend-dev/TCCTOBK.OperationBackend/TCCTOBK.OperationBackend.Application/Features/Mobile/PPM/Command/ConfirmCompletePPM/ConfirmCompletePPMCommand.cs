using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class ConfirmCompletePPMCommand : IRequest<ConfirmCompletePPMResult>
{
  public int ServicingObjectId { get; set; }
  public Guid CompletedBy { get; set; }
}
