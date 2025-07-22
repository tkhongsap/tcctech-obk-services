using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application;

public class CheckTimeCardEntriesHandler : IRequestHandler<CheckTimeCardEntriesQuery, CheckTimeCardEntriesResult>
{
  IOPAPPUnitOfWork _uow;
  public CheckTimeCardEntriesHandler(IOPAPPUnitOfWork uow)
  {
    _uow = uow;
  }
  public async Task<CheckTimeCardEntriesResult> Handle(CheckTimeCardEntriesQuery request, CancellationToken cancellationToken)
  {
    var res = new CheckTimeCardEntriesResult();
    res.IsCheck = true;
    var dtnow = DateTime.Now.Date;
    var data = await _uow.TimeCardEntries.GetByKCUsername(request.KCUsername, dtnow);
    if (data != null)
    {
      res.IsCheck = false;
    }
    return res;
  }
}
