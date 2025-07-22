using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;

public class CheckTimeHandler : IRequestHandler<CheckTimeCommand, CheckTimeResult>
{
  IOPAPPUnitOfWork _uow;
  public CheckTimeHandler(IOPAPPUnitOfWork uow)
  {
    _uow = uow;
  }
  public async Task<CheckTimeResult> Handle(CheckTimeCommand request, CancellationToken cancellationToken)
  {
    var res = new CheckTimeResult();
    res.CheckIn = DateTime.Now;
    res.CheckInString = DateTime.Now.ToString();
    res.CheckOut = null;
    res.CheckOutString = null;
    res.CheckInCode = "";
    return res;
  }
}
