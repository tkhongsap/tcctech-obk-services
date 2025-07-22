using NPOI.HPSF;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;
using TCCTOBK.OperationBackend.Domain;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetUpdateMozartSupervisorTechnicain;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;

namespace TCCTOBK.OperationBackend.Application;

public class TechnicianHandler : IQueryHandler<TechnicianQuery, TechnicianResult>
{
  private readonly IUnitOfWork _uow;
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;

  public TechnicianHandler(IAbstractionService apiService, IMasterDataService masterDataSevice, IUnitOfWork uow)
  {
    _uow = uow;
    _apiService = apiService;
    _masterDataService = masterDataSevice;
  }

  public async Task<TechnicianResult> Handle(TechnicianQuery request, CancellationToken cancellationToken)
  {
    var users = await _uow.MemberRepository.GetByTenant(Constant.TENANT_OPERATION_APP_ID, true);
    var technician = await _apiService.MasterData.GetAllFMTechnician();
    technician = technician.Where(x => users.Any(u => u.Email.ToLower() == x.Email.ToLower())).ToList();
    var technicianservice = await _masterDataService.FMTechnicianServices(_apiService.MasterData.FMTechnicianServices);
    var res = new TechnicianResult();
    var rs = new List<TechniciansData>();
    foreach (var technicianItem in technician)
    {
      var user = users.FirstOrDefault(x => x.Email == technicianItem.Email);
      // if (user != null && user.DataJson != null)
      // {
      //   var profile = JsonSerializer.Deserialize<MemberDataJsonModel>(user.DataJson);
      //   if (profile?.SupervisorService != null) continue;
      // }
      var techtype = GetUserType(technicianItem.Id.ToString(), technicianservice);
      // if (request.ServiceType != null && request.ServiceType != techtype) continue;
      rs.Add(new TechniciansData()
      {
        Id = technicianItem.Id.ToString(),
        FullName = technicianItem.FullName,
        UserType = 1,
        IsAvailable = true,
        Service = techtype, // 1 tech , 2 clean
      });
    }
    res.Data = rs;
    res.Available = res.Data.Count(x => x.IsAvailable);
    res.Total = res.Data.Count();
    return res;
  }

  public int GetUserType(string technicianId, List<FMTechniciansServiceResult> technicianServices)
  {
    var service = technicianServices.Where(x => x.TechnicianId == technicianId);
    if (service == null)
    {
      return 1;
    }
    var category = service.Any(x => Constant.CERTIS_CLEANER_SERVICE_CATEGORY == x.ServiceCategoryId);
    return category ? 2 : 1;
  }

}
