using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application;

public class CheckTimeSheetHandler : IQueryHandler<CheckTimeSheetQuery, CheckTimeSheetResult>
{
  IOPAPPUnitOfWork _uow;
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;
  public CheckTimeSheetHandler(IOPAPPUnitOfWork uow, IAbstractionService apiService, IMasterDataService masterDataSevice)
  {
    _uow = uow;
    _apiService = apiService;
    _masterDataService = masterDataSevice;
  }
  public async Task<CheckTimeSheetResult> Handle(CheckTimeSheetQuery request, CancellationToken cancellationToken)
  {
    var res = new CheckTimeSheetResult();
    var check = await _uow.TimeCardEntries.GetByKCUsername(request.KCUsername, DateTime.Now);

    if (check == null)
    {
      res.isCheckIn = false;
      res.isCheckOut = false;
      return res;
    }
    var locations = await _masterDataService.GetAllAssets(_apiService.MasterData.GetAllAssets);
    var checkinlocation = await _uow.TimeSheet.GetByID(check.TSID);
    var location = locations.FirstOrDefault(x => x.LocationId == checkinlocation.Location);
    if (location != null)
    {
      res.Location = location.LocationId;
      res.Asset = location.Id;
    }
    res.isCheckIn = true;
    res.isCheckOut = check.CheckOut != null;
    res.CheckInDate = check.CheckIn;
    res.CheckInDateText = check.CheckIn.ToLongDateString();
    res.CheckInTimeText = check.CheckIn.ToLongTimeString();
    res.CheckOutDate = check.CheckOut;
    res.CheckOutDateText = check.CheckOut == null ? "-" : check.CheckOut.Value.ToLongDateString();
    res.CheckOutTimeText = check.CheckOut == null ? "-" : check.CheckOut.Value.ToLongTimeString();
    return res;
  }
}
