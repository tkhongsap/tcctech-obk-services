using System;
using System.Text.Json;
using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Exceptions;
using TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Authentication.Query.GetUpdateMozartSupervisorTechnicain;

public class GetUpdateMozartSupervisorTechnicainHandler : IQueryHandler<GetUpdateMozartSupervisorTechnicainQuery, GetUpdateMozartSupervisorTechnicainResult>
{
  private readonly IUnitOfWork _uow;
  private readonly IAbstractionService _abstractionService;

  public GetUpdateMozartSupervisorTechnicainHandler(IUnitOfWork uow, IAbstractionService abstractionService)
  {
    _uow = uow;
    _abstractionService = abstractionService;
  }

  public async Task<GetUpdateMozartSupervisorTechnicainResult> Handle(GetUpdateMozartSupervisorTechnicainQuery request, CancellationToken cancellationToken)
  {
    var datajson = new MemberDataJsonModel();
    var userData = await _uow.MemberRepository.GetByEmail(request.Email);
    if (userData == null) throw new NotFoundException("Not found Member");
    datajson = JsonSerializer.Deserialize<MemberDataJsonModel>(userData.DataJson);
    if (datajson == null)
    {
      datajson.Email = request.Email;
      datajson.MozartUserId = request.MozartId;
    }
    //TODO : Update All data exclude mozartUser id to base layer
    var mozartId = request.MozartId.ToString();
    var supervisorData = await _abstractionService.MasterData.FMSupervisorsServices();
    var technicainData = await _abstractionService.MasterData.FMTechnicianServices();
    var filtersupervisort = supervisorData.Where(x => x.SupervisorId == mozartId).ToList();
    var filtertechnicainData = technicainData.Where(x => x.TechnicianId == mozartId).ToList();
    datajson.SupervisorService = filtersupervisort;
    datajson.TechnicianService = filtertechnicainData;
    var datajsonstring = JsonSerializer.Serialize(datajson);
    await _uow.MemberRepository.UpdateDataJson(userData.MID, datajsonstring);
    await _uow.SaveChangeAsyncWithCommit();
    var res = new GetUpdateMozartSupervisorTechnicainResult();
    return res;
  }
}
