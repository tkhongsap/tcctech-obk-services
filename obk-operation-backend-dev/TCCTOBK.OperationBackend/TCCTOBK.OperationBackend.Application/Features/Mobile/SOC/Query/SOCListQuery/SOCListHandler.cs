using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
namespace TCCTOBK.OperationBackend.Application;

public class SOCListHandler : IQueryHandler<SOCListQuery, List<SOCListResult>>
{
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;

  public SOCListHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
  {
    _apiService = apiService;
    _masterDataService = masterDataSevice;
  }

  public async Task<List<SOCListResult>> Handle(SOCListQuery request, CancellationToken cancellationToken)
  {
    var socdata = await _apiService.CertisTransaction.GetAllCorrectiveWorkOrder();
    var status = new List<int>() { 1, 2, 3, 4, 5, 6, 8 };
    socdata = socdata.Where(x => status.Contains(x.StatusId) && x.ServiceCategoryId == 34).ToList();
    socdata = socdata.OrderByDescending(x => x.CreatedOn).ToList();
    var location = await _masterDataService.GetAllLocation(_apiService.MasterData.GetAllLocation);
    var res = socdata.Select(x => new SOCListResult()
    {
      CWOID = x.Id,
      ProblemType = x.ProblemTypeId,
      Description = x.Description,
      CreatedDate = x.CreatedOn.ToString("dd/mm/yyyy:hh:mm"),
      Priority = GetPriorityText(x.PriorityId),
      Location = location.FirstOrDefault(a => a.id == x.Id)!.name,
      Status = x.StatusId
    }).ToList();
    return res;
  }


  private string GetPriorityText(int id)
  {
    if (id == 1)
    {
      return "cat 1";
    }
    if (id == 2)
    {
      return "cat 2";
    }
    if (id == 3)
    {
      return "cat 3";
    }
    return "";
  }

}

