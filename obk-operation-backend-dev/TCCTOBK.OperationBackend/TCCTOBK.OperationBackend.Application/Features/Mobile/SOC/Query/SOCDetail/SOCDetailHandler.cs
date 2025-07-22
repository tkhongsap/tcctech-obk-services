using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application;

public class SOCDetailHandler : IQueryHandler<SOCDetailQuery, SOCDetailResult>
{
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;

  public SOCDetailHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
  {
    _apiService = apiService;
    _masterDataService = masterDataSevice;
  }

  public async Task<SOCDetailResult> Handle(SOCDetailQuery request, CancellationToken cancellationToken)
  {
    var socdata = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
    var data = socdata.FirstOrDefault(x => x.Id == request.Id);
    var task = await _apiService.CertisTransaction.GetCWODetail(request.Id.ToString());
    var location = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);
    var status = await _masterDataService.GetAllStatus(_apiService.MasterData.GetAllStatus);
    var res = new SOCDetailResult();
    res.Description = data.Description;
    res.Status = status.FirstOrDefault(x => x.Id == data.StatusId).Name;
    res.CaseNo = data.Name;
    res.Date = DateTime.Now.ToLongDateString();
    res.Time = DateTime.Now.ToLongTimeString();
    res.Location = location.FirstOrDefault(x => x.id == data.LocationId).name;
    res.Critical = "YES";
    res.Priority = data.PriorityId.ToString();
    res.SLA = DateTime.Now.ToLongDateString();
    res.SLATime = DateTime.Now.ToLongTimeString();
    res.Task = task.Select(x => new TaskSOC()
    {
      Id = x.TaskId,
      Title = x.Description,
    }).ToList();
    return res;
  }
}
