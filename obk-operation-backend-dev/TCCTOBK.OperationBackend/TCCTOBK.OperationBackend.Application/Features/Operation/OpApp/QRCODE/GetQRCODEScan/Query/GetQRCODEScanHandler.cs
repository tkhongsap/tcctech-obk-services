using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;

public class GetQRCODEScanHandler : IRequestHandler<GetQRCODEScanQuery, GetQRCODEScanResult>
{
  IOPAPPUnitOfWork _uow;
  public GetQRCODEScanHandler(IOPAPPUnitOfWork uow)
  {
    _uow = uow;
  }
  public async Task<GetQRCODEScanResult> Handle(GetQRCODEScanQuery request, CancellationToken cancellationToken)
  {
    byte[] byteArray = Convert.FromBase64String(request.CheckCode);
    string code = System.Text.Encoding.UTF8.GetString(byteArray);
    var data = await _uow.TimeSheet.GetByCheckCode(code);
    if (data == null)
    {
      return new GetQRCODEScanResult() { TSID = null };
    }
    return new GetQRCODEScanResult() { TSID = data.TSID };
  }
}
