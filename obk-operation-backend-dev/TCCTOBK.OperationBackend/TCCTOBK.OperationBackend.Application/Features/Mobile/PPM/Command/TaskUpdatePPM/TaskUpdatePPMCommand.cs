using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class TaskUpdatePPMCommand : IRequest<TaskUpdatePPMResult>
{
  public int ppmId { get; set; }
  public int Id { get; set; }
  public string TaskStatus { get; set; }
  public string Remarks { get; set; }
  public string Reading { get; set; }
  public Guid UpdatedBy { get; set; }
  public int serviceObjectId { get; set; }
}
