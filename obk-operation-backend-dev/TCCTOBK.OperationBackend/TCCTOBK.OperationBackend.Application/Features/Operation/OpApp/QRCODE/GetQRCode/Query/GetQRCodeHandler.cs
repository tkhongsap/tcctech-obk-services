using MediatR;
using Org.BouncyCastle.Math.EC.Rfc7748;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.OpApp;

public class GetQRCodeHandler : IRequestHandler<GetQRCodeQuery, GetQRCodeResult>
{
  IOPAPPUnitOfWork _uow;
  public GetQRCodeHandler(IOPAPPUnitOfWork uow)
  {
    _uow = uow;
  }
  public async Task<GetQRCodeResult> Handle(GetQRCodeQuery request, CancellationToken cancellationToken)
  {
    var timeSheetData = await _uow.TimeSheet.GetAll();
    var res = new GetQRCodeResult();
    var qrDataList = timeSheetData.Select(item =>
    {
      var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(item.CheckCode);
      var textString = System.Convert.ToBase64String(plainTextBytes);
      return new QRData
      {
        Location = item.Location,
        Data = textString
      };
    }).ToList();
    res.QRData = qrDataList;
    return res;
  }
}
