using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;

public class StampTimeSheetHandler : IRequestHandler<StampTimeSheetCommand, StampTimeSheetResult>
{
  IOPAPPUnitOfWork _uow;
  public StampTimeSheetHandler(IOPAPPUnitOfWork uow)
  {
    _uow = uow;
  }
  public async Task<StampTimeSheetResult> Handle(StampTimeSheetCommand request, CancellationToken cancellationToken)
  {
    var today = DateTime.Now;
    var res = new StampTimeSheetResult();
    var check = await _uow.TimeCardEntries.GetByKCUsername(request.KCUsername, today.Date);
    byte[] byteArray = Convert.FromBase64String(request.CheckCode);
    string code = System.Text.Encoding.UTF8.GetString(byteArray);
    var data = await _uow.TimeSheet.GetByCheckCode(code);
    if (data == null)
    {
      return new StampTimeSheetResult() { IsSuccess = false };
    }
    if (check == null)
    {
      res.IsSuccess = await _uow.TimeCardEntries.CheckIn(data.TSID, request.KCUsername);
    }
    else
    {
      res.IsSuccess = await _uow.TimeCardEntries.CheckOut(data.TSID, request.KCUsername);
    }
    await _uow.SaveChangeAsyncWithCommit();
    var stampdata = await _uow.TimeCardEntries.GetByKCUsername(request.KCUsername, today);
    if (stampdata == null)
    {
      return new StampTimeSheetResult() { IsSuccess = false };
    }
    res.Data.KCusername = stampdata.KCUsername;
    res.Data.Location = data.Location;
    res.Data.CheckInDate = stampdata.CheckIn;
    res.Data.CheckInDateText = stampdata.CheckIn.ToLongDateString();
    res.Data.CheckInTimeText = stampdata.CheckIn.ToLongTimeString();
    res.Data.CheckOutDate = stampdata.CheckOut;
    res.Data.CheckOutDateText = stampdata.CheckOut == null ? "-" : stampdata.CheckOut.Value.ToLongDateString();
    res.Data.CheckOutTimeText = stampdata.CheckOut == null ? "-" : stampdata.CheckOut.Value.ToLongTimeString();
    return res;
  }
}
