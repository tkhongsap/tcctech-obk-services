using MediatR;

namespace TCCTOBK.OperationBackend.Application;

public class CheckTimeCardEntriesQuery : IRequest<CheckTimeCardEntriesResult>
{
  public string KCUsername { get; set; } = default!;
  public Guid TSID { get; set; }
  public CheckTimeCardEntriesQuery(string kcusername, Guid tsid)
  {
    KCUsername = kcusername;
    TSID = tsid;
  }
}
