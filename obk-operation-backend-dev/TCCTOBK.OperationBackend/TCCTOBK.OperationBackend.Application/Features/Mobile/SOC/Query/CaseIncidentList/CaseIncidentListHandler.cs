using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
namespace TCCTOBK.OperationBackend.Application;

public class CaseIncidentListHandler : IQueryHandler<CaseIncidentListQuery, CaseIncidentListResult>
{
  private readonly IAbstractionService _apiService;

  public CaseIncidentListHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<CaseIncidentListResult> Handle(CaseIncidentListQuery request, CancellationToken cancellationToken)
  {
    var result = await _apiService.CertisTransaction.GetCaseIndidentList(null);
    var dt = result.Select(x => new CaseIncidentItem()
    {
      Id = x.Id,
      ShortDesc = x.ShortDesc,
      CaseNo = x.CaseNo,
      EventTypeId = x.EventTypeId,
      EventTypeCode = x.EventTypeCode,
      LocationId = x.LocationId,
      LocationCode = x.LocationCode,
      LocationName = x.LocationName,
      PriorityLevelId = x.PriorityLevelId,
      SlaConfigId = x.SlaConfigId,
      CaseTypeId = x.CaseTypeId,
      SiteHandler = x.SiteHandler,
      StatusCode = x.StatusCode,
      Timestamp = x.Timestamp,
      CreatedOn = x.CreatedOn,
      CreatedBy = x.CreatedBy,
      SlaFailed = x.SlaFailed,
      SlaDate = x.SlaDate,
      Description = x.Description,
      EquipmentTag = x.EquipmentTag,
      ExternalRefNo = x.ExternalRefNo,
      IsCritical = x.IsCritical,
    }).ToList();
    var res = new CaseIncidentListResult();
    res.Data = dt;
    res.Total = res.Data.Count();
    res.OpenCount = res.Data.Where(x => x.StatusCode == 1).Count();
    res.CompleteCount = res.Data.Where(x => x.StatusCode == 4 || x.StatusCode == 3).Count();
    return res;
  }
}

