using Org.BouncyCastle.Asn1.Misc;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class CWOListHandler : IQueryHandler<CWOListQuery, CWOListResult>
{

  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;
  private IUnitOfWork _uow;

  public CWOListHandler(IAbstractionService apiService, IMasterDataService masterDataSevice, IUnitOfWork uow)
  {
    _apiService = apiService;
    _masterDataService = masterDataSevice;
    _uow = uow;
  }

  public async Task<CWOListResult> Handle(CWOListQuery request, CancellationToken cancellationToken)
  {
    // Fetch data from services
   // var cwodata = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
    var cwodata = await _uow.CWORepository.GetAll(null, null, null, null, false, request.UserId, request.Role, request.IsSoc, null, true, request);
    var locations = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);
    var serviceCategories = await _masterDataService.GetServiceCategories(_apiService.MasterData.GetServiceCategories);
    var priority = await _masterDataService.FMRelatedPriorities(_apiService.MasterData.FMRelatedPriorities);
    var statusCounts = cwodata.GroupBy(x => x.StatusId)
        .ToDictionary(g => g.Key, g => g.Count());
    var data = cwodata.Select(x => new CWOData
    {
      CWOID = x.Id,
      ProblemType = x.ProblemTypeId,
      Description = x.Description,
      CreatedDate = x.CreatedOn == null ? "-" : x.CreatedOn?.AddHours(7).ToString("dd MMM yyyy h:mm:sstt"),
      Priority = priority.FirstOrDefault(p => p.Id == x.PriorityId)?.Name ?? "-",
      Location = locations.FirstOrDefault(loc => loc.id == x.LocationId)?.name ?? "-",
      Status = x.StatusId ?? 0,
      IsPause = x.IsPaused ?? false,
      PriorityId = x.PriorityId,
      ServiceCategory = serviceCategories.FirstOrDefault(a => a.Id == x.ServiceCategoryId)?.Name
    }).ToList();
    var res = new CWOListResult
    {
      Items = cwodata.Count(),
      NEWItems = statusCounts.GetValueOrDefault(2, 0),
      ACKNOWLEDGEMENTItems = statusCounts.GetValueOrDefault(3, 0),
      INPROGRESSItems = statusCounts.GetValueOrDefault(4, 0),
      COMPLETEDItems = statusCounts.GetValueOrDefault(5, 0),
      CLOSEDItems = statusCounts.GetValueOrDefault(6, 0),
      CANCELLEDItems = statusCounts.GetValueOrDefault(8, 0),
      VERIFYItem = statusCounts.GetValueOrDefault(7, 0),
      Data = data
    };
    return res;
  }
}

