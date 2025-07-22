using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class CWODetailHandler : IQueryHandler<CWODetailQuery, CWODetailResult>
{
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;
  private IUnitOfWork _uow;


  public CWODetailHandler(IAbstractionService apiService, IMasterDataService masterDataSevice, IUnitOfWork uow)
  {
    _apiService = apiService;
    _masterDataService = masterDataSevice;
    _uow = uow;
  }

  public async Task<CWODetailResult> Handle(CWODetailQuery request, CancellationToken cancellationToken)
  {
    var asset = new List<AssetResult>();
    var location = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);

    try
    {
      asset = await _masterDataService.GetAllAssets(_apiService.MasterData.GetAllAssets);
    }
    catch
    {

    }
    var statuscode = await _masterDataService.GetAllStatus(_apiService.MasterData.GetAllStatus);
    var servicecategories = await _masterDataService.GetServiceCategories(_apiService.MasterData.GetServiceCategories);
    var supervisor = await _masterDataService.FMsupervisors(_apiService.MasterData.FMsupervisors);
    var technicain = await _masterDataService.GetAllFMTechnician(_apiService.MasterData.GetAllFMTechnician);
    var problemtypes = await _masterDataService.ProblemTypes(_apiService.MasterData.ProblemTypes);
    var cwotype = await _masterDataService.CWOType(_apiService.MasterData.CWOType);
    var requester = await _masterDataService.Requesters(_apiService.MasterData.Requesters);
    var priority = await _masterDataService.FMRelatedPriorities(_apiService.MasterData.FMRelatedPriorities);

    #region Call CWO and Master Data
    //var cwolist = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
    //var cwo = await _apiService.CertisTransaction.GetCWODetail(request.Id.ToString());
    var document = await _apiService.CertisTransaction.GetDocumentFiles("CWO", request.Id.ToString());
    var documentAll = await _apiService.CertisTransaction.CWODocumentsRelated(request.Id);

    var cwodata = await _uow.CWORepository.GetById(request.Id, true);

    // Get documents only create from mozart
    var images = document.Where(x => string.IsNullOrEmpty(x.SearchTags)).Select(x => new DocumentWork { Id = x.Id, Description = x.Description, SearchTags = "from_mozart" }).ToList();
    var imageAll = documentAll.Select(x => new DocumentWork { Id = x.Id, Description = x.Description, SearchTags = "from_mozart" }).ToList();
    #endregion

    #region Map Data
    var res = new CWODetailResult
    {
      CWOID = cwodata.Id,
      Status = cwodata.StatusId ?? 0,
      Statustext = GetStatusText(cwodata.StatusId ?? 0),
      CWORefNumber = cwodata.Name,
      CaseRefNumber = cwodata.Name,
      CreatedBy = supervisor.FirstOrDefault(x => x.id == cwodata.CreatedBy)?.fullName ?? null,
      Requester = requester.FirstOrDefault(x => x.Id == cwodata.RequesterId)?.Name ?? null,
      RequesterId = cwodata.RequesterId ?? 0,
      Priority = cwodata.PriorityId,
      IsPause = cwodata.IsPaused ?? false,
      PriorityText = priority.FirstOrDefault(p => p.Id == cwodata.PriorityId)?.Name ?? "-",
      Tower = location.FirstOrDefault(x => x.topLocationId == cwodata.LocationId)?.fullName ?? null,
      Location = location.FirstOrDefault(x => x.id == cwodata.LocationId)?.fullName ?? null,
      LocationId = cwodata.LocationId,
      ServiceCategory = servicecategories.FirstOrDefault(x => x.Id == cwodata.ServiceCategoryId)?.Name ?? null,
      CWOType = cwotype.FirstOrDefault(x => x.Id == cwodata.CwoTypeId)?.Name ?? null,
      Asset = asset.FirstOrDefault(x => x.Id == cwodata.AssetId)?.Name ?? "N/A",
      AssetId = cwodata.AssetId ?? 0,
      Supervisor = supervisor.FirstOrDefault(x => x.id == cwodata.SupervisorId)?.fullName ?? null,
      Technicain = technicain.FirstOrDefault(x => x.Id == cwodata.TechnicianId)?.FullName ?? null,
      SupervisorId = cwodata.SupervisorId,
      TechnicainId = cwodata.TechnicianId,
      WorkDescription = cwodata.Description,
      Problemtype = problemtypes.FirstOrDefault(x => x.Id == cwodata.ProblemTypeId)?.Name ?? null,
      ProblemtypeId = cwodata.ProblemTypeId,
      Documents = images,
      DocumentAll = imageAll,
      SlaStart = cwodata.SlaStartDateTime == null ? "-" : TimeZoneInfo.ConvertTimeFromUtc(cwodata.SlaStartDateTime ?? DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById(OpAppConstant.TimeZoneTH)).ToString(OpAppConstant.TimeFormat),
      SlaToResponse = cwodata.SlatoRespond == null ? "-" : TimeZoneInfo.ConvertTimeFromUtc(cwodata.SlatoRespond ?? DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById(OpAppConstant.TimeZoneTH)).ToString(OpAppConstant.TimeFormat),
      SlaToResolve = cwodata.SlatoResolve == null ? "-" : TimeZoneInfo.ConvertTimeFromUtc(cwodata.SlatoResolve ?? DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById(OpAppConstant.TimeZoneTH)).ToString(OpAppConstant.TimeFormat),
      EstimatedCompletion = cwodata.EstimatedCompletion == null ? "-" : TimeZoneInfo.ConvertTimeFromUtc(cwodata.EstimatedCompletion ?? DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById(OpAppConstant.TimeZoneTH)).ToString(OpAppConstant.TimeFormat),
      ActualStart = cwodata.ActualStartDateTime == null ? "-" : TimeZoneInfo.ConvertTimeFromUtc(cwodata.ActualStartDateTime ?? DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById(OpAppConstant.TimeZoneTH)).ToString(OpAppConstant.TimeFormat),
      ActualCompletion = cwodata.ActualCompletionDateTime == null ? "-" : TimeZoneInfo.ConvertTimeFromUtc(cwodata.ActualCompletionDateTime ?? DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById(OpAppConstant.TimeZoneTH)).ToString(OpAppConstant.TimeFormat),
    };
    #endregion
    return res;
  }

  private string GetStatusText(int id)
  {
    var statustext = "N/A";
    switch (id)
    {
      case 1:
        statustext = "NOT ASSIGNED";
        break;
      case 2:
        statustext = "New";
        break;
      case 3:
        statustext = "Assigned";
        break;
      case 4:
        statustext = "In progress";
        break;
      case 5:
        statustext = "Completed";
        break;
      case 6:
        statustext = "Close";
        break;
      case 7:
        statustext = "CLIENT VERIFY";
        break;
      case 8:
        statustext = "Cancle";
        break;
    }
    return statustext;
  }
}
